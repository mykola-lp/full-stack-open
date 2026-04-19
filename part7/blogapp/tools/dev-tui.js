/**
 * Dev process orchestrator with a minimal terminal UI.
 *
 * This script runs backend (server) and frontend (client) dev servers
 * in parallel and renders their logs in a split terminal layout.
 *
 * It uses line-buffered stream handling to avoid broken log lines,
 * fixed-size per-pane buffers, throttled ANSI re-rendering,
 * and a small keyboard-driven TUI for local development.
 */

const { spawn } = require('node:child_process')
const path = require('node:path')
const readline = require('node:readline')

// --- RUNTIME CONFIG + SHARED STATE ---

const rootDir = path.resolve(__dirname, '..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const processes = []
const isInteractive = Boolean(process.stdout.isTTY && process.stdin.isTTY)
const MIN_PANE_WIDTH = 48
const STACKED_LAYOUT_WIDTH = 120
const GUTTER_WIDTH = 3
const MAX_BUFFERED_LINES = 600
const RENDER_INTERVAL_MS = 80
const FORCE_KILL_TIMEOUT_MS = 3000
const ANSI_PATTERN = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g
const isWindows = process.platform === 'win32'

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  blueBg: '\x1b[44m',
}

const panes = {
  server: createPane('server'),
  client: createPane('client'),
}

const paneOrder = ['server', 'client']

let isShuttingDown = false
let closedProcessCount = 0
let uiRestored = false
let activePaneKey = 'server'
let fullscreenPaneKey = null
let renderTimer = null
let lastRenderAt = 0
let startTime = null
let forceExitTimer = null
let lastShutdownRequestAt = 0

// --- PANE MODEL ---

function createPane(name) {
  return {
    name,
    lines: [],
    partialStdout: '',
    partialStderr: '',
    exited: false,
    exitCode: null,
    signal: null,
    scrollOffset: 0,
    wrapCache: createWrapCache(),
  }
}

function createWrapCache() {
  return {
    width: 0,
    wrappedLines: [],
    lineWrapCounts: [],
  }
}

// --- TEXT + ANSI HELPERS ---

function stripAnsi(text) {
  return text.replace(ANSI_PATTERN, '')
}

function visibleLength(text) {
  return stripAnsi(text).length
}

function truncatePlainText(text, width) {
  if (width <= 0) {
    return ''
  }

  if (text.length <= width) {
    return text.padEnd(width, ' ')
  }

  if (width <= 3) {
    return text.slice(0, width)
  }

  return `${text.slice(0, width - 3)}...`
}

// --- BUFFERING + STREAM INGESTION ---

function wrapLine(line, width) {
  if (width <= 0) {
    return ['']
  }

  if (line.length === 0) {
    return ['']
  }

  const wrapped = []

  for (let index = 0; index < line.length; index += width) {
    wrapped.push(line.slice(index, index + width))
  }

  return wrapped
}

function appendWrappedLine(target, line, width) {
  const wrapped = wrapLine(line, width)

  for (let index = 0; index < wrapped.length; index += 1) {
    target.push(wrapped[index])
  }

  return wrapped.length
}

function rebuildWrapCache(pane, width) {
  const wrappedLines = []
  const lineWrapCounts = []

  pane.lines.forEach((line) => {
    lineWrapCounts.push(appendWrappedLine(wrappedLines, line, width))
  })

  pane.wrapCache = {
    width,
    wrappedLines,
    lineWrapCounts,
  }
}

function ensureWrapCache(pane, width) {
  if (pane.wrapCache.width !== width) {
    rebuildWrapCache(pane, width)
  }

  return pane.wrapCache
}

function appendLine(pane, line, source = 'out') {
  const label = source === 'err' ? 'ERR' : 'OUT'
  const cleanLine = stripAnsi(line).replace(/\t/g, '  ')
  const nextLine = `${label} ${cleanLine}`

  pane.lines.push(nextLine)

  if (pane.wrapCache.width > 0) {
    pane.wrapCache.lineWrapCounts.push(
      appendWrappedLine(pane.wrapCache.wrappedLines, nextLine, pane.wrapCache.width)
    )
  }

  if (pane.lines.length > MAX_BUFFERED_LINES) {
    const removed = pane.lines.length - MAX_BUFFERED_LINES
    pane.lines.splice(0, removed)

    if (pane.wrapCache.width > 0) {
      let removedWrappedLines = 0

      for (let index = 0; index < removed; index += 1) {
        removedWrappedLines += pane.wrapCache.lineWrapCounts[index] || 0
      }

      pane.wrapCache.lineWrapCounts.splice(0, removed)
      pane.wrapCache.wrappedLines.splice(0, removedWrappedLines)
    }

    pane.scrollOffset = Math.max(pane.scrollOffset - removed, 0)
  }

  if (pane.scrollOffset === 0) {
    return
  }

  pane.scrollOffset = Math.min(
    pane.scrollOffset + 1,
    Math.max(pane.lines.length - 1, 0)
  )
}

function flushBuffer(pane, key, source) {
  if (!pane[key]) {
    return
  }

  appendLine(pane, pane[key], source)
  pane[key] = ''
}

function consumeStream(pane, key, source, chunk) {
  pane[key] += chunk.toString()

  const parts = pane[key].split(/\r?\n/)
  pane[key] = parts.pop() || ''

  for (let index = 0; index < parts.length; index += 1) {
    appendLine(pane, parts[index], source)
  }

  scheduleRender()
}

// --- STATUS + VISUAL TOKENS ---

function getStatusText(pane) {
  if (!pane.exited) {
    return 'running'
  }

  if (pane.exitCode === 0) {
    return 'done'
  }

  if (pane.signal) {
    return `stopped ${pane.signal}`
  }

  return `failed ${pane.exitCode}`
}

function getStatusColor(pane) {
  if (!pane.exited) {
    return colors.green
  }

  if (pane.exitCode === 0) {
    return colors.cyan
  }

  if (pane.signal) {
    return colors.yellow
  }

  return colors.red
}

function getPaneAccent(pane) {
  return pane.name === 'server' ? colors.cyan : colors.magenta
}

// --- TERMINAL LAYOUT + VIEWPORTS ---

function makeBorder(width) {
  if (width <= 1) {
    return '-'.repeat(Math.max(width, 0))
  }

  return `+${'-'.repeat(Math.max(width - 2, 0))}+`
}

function overlayLabel(border, label) {
  const borderWidth = stripAnsi(border).length
  const availableWidth = Math.max(borderWidth - 4, 0)
  const renderedLabel = truncatePlainText(stripAnsi(label), availableWidth)
  const labelLength = visibleLength(renderedLabel)

  return `+ ${renderedLabel}${'-'.repeat(Math.max(borderWidth - labelLength - 4, 0))} +`
}

function formatContentLine(line, width) {
  const cleanLine = truncatePlainText(line, width)

  if (cleanLine.startsWith('ERR ')) {
    return `${colors.red}${cleanLine}${colors.reset}`
  }

  if (cleanLine.startsWith('OUT ')) {
    return `${colors.dim}${cleanLine}${colors.reset}`
  }

  return cleanLine
}

function makeEmptyContent(width, active) {
  const side = active ? `${colors.bold}${colors.white}|${colors.reset}` : '|'
  return `${side}${''.padEnd(width, ' ')}${side}`
}

function getViewportLines(pane, visibleHeight, contentWidth) {
  const { wrappedLines } = ensureWrapCache(pane, contentWidth)
  const maxStart = Math.max(wrappedLines.length - visibleHeight, 0)
  const start = Math.max(maxStart - pane.scrollOffset, 0)
  const sliced = wrappedLines.slice(start, start + visibleHeight)
  const padding = Math.max(visibleHeight - sliced.length, 0)
  const visible =
    padding > 0 ? Array(padding).fill('').concat(sliced) : sliced

  return {
    visible,
    total: wrappedLines.length,
    start,
    maxStart,
  }
}

function getPaneOutput(pane, width, height) {
  const contentWidth = Math.max(width - 2, 1)
  const visibleHeight = Math.max(height - 2, 1)
  const accent = getPaneAccent(pane)
  const statusColor = getStatusColor(pane)
  const isActive = activePaneKey === pane.name
  const titleText = pane.name.toUpperCase()
  const statusText = getStatusText(pane)
  const viewport = getViewportLines(pane, visibleHeight, contentWidth)
  const scrollText =
    viewport.total > visibleHeight
      ? `scroll ${Math.max(viewport.total - visibleHeight - pane.scrollOffset, 0)}/${viewport.total - visibleHeight}`
      : 'tail'
  const activeText = isActive ? 'active' : 'idle'
  const headerPlain = `${titleText} | ${statusText} | ${activeText} | ${scrollText}`
  const topBorderPlain = overlayLabel(makeBorder(width), headerPlain)
  const borderColor = isActive ? colors.bold + accent : accent
  const topBorder = topBorderPlain
    .replace(titleText, `${colors.bold}${accent}${titleText}${colors.reset}`)
    .replace(
      `| ${statusText}`,
      `${colors.dim}|${colors.reset} ${statusColor}${statusText}${colors.reset}`
    )
    .replace(
      `| ${activeText}`,
      `${colors.dim}|${colors.reset} ${isActive ? colors.white : colors.gray}${activeText}${colors.reset}`
    )
    .replace(
      `| ${scrollText}`,
      `${colors.dim}|${colors.reset} ${colors.gray}${scrollText}${colors.reset}`
    )
  const bottomBorder = `${borderColor}${makeBorder(width)}${colors.reset}`
  const content = viewport.visible.map((line) => {
    const side = isActive
      ? `${colors.bold}${colors.white}|${colors.reset}`
      : '|'
    return `${side}${formatContentLine(line, contentWidth)}${side}`
  })

  return [`${borderColor}${topBorder}${colors.reset}`, ...content, bottomBorder]
}

// --- RENDER ---

function getLayout(totalWidth) {
  if (fullscreenPaneKey) {
    return {
      mode: 'fullscreen',
      paneWidth: Math.max(totalWidth, MIN_PANE_WIDTH),
    }
  }

  const halfWidth = Math.floor((totalWidth - GUTTER_WIDTH) / 2)

  if (totalWidth < STACKED_LAYOUT_WIDTH || halfWidth < MIN_PANE_WIDTH) {
    return {
      mode: 'stacked',
      paneWidth: Math.max(totalWidth, MIN_PANE_WIDTH),
    }
  }

  return {
    mode: 'columns',
    paneWidth: Math.max(halfWidth, MIN_PANE_WIDTH),
  }
}

function getStatusBar(totalWidth, layoutMode) {
  const serverStatus = `server:${getStatusText(panes.server)}`
  const clientStatus = `client:${getStatusText(panes.client)}`
  const focus = `focus:${activePaneKey}`
  const view = fullscreenPaneKey ? `view:${fullscreenPaneKey}` : `view:split`
  const text = ` ${serverStatus} | ${clientStatus} | ${focus} | ${view} | layout:${layoutMode} `
  const body = truncatePlainText(text, Math.max(totalWidth, 1))

  return `${colors.blueBg}${colors.white}${body}${colors.reset}`
}

function getHelpBar(totalWidth) {
  const help =
    ' Keys: Tab switch | Up/Down or j/k scroll | PgUp/PgDn fast | Enter fullscreen | Esc exit fullscreen | End/G tail | g up | Ctrl+C stop '
  const body = truncatePlainText(help, Math.max(totalWidth, 1))

  return `${colors.dim}${body}${colors.reset}`
}

function renderColumns(totalWidth, totalHeight, paneWidth) {
  const paneHeight = Math.max(totalHeight - 3, 3)
  const left = getPaneOutput(panes.server, paneWidth, paneHeight)
  const right = getPaneOutput(panes.client, paneWidth, paneHeight)
  const rowCount = Math.max(left.length, right.length)
  const rows = []
  const gutter = ' '.repeat(GUTTER_WIDTH)
  const emptyLine = ''.padEnd(paneWidth, ' ')

  for (let index = 0; index < rowCount; index += 1) {
    const leftLine = left[index] || emptyLine
    const rightLine = right[index] || emptyLine
    rows.push(`${leftLine}${gutter}${rightLine}`)
  }

  return rows.slice(0, Math.max(totalHeight - 1, 0))
}

function renderStacked(totalWidth, totalHeight, paneWidth) {
  const availableRows = Math.max(totalHeight - 3, 6)
  const paneHeight = Math.max(Math.floor((availableRows - 1) / 2), 3)
  const topPane = getPaneOutput(panes.server, paneWidth, paneHeight)
  const bottomPane = getPaneOutput(panes.client, paneWidth, paneHeight)
  const rows = [...topPane, ''.padEnd(paneWidth, ' '), ...bottomPane]

  return rows.slice(0, Math.max(totalHeight - 1, 0))
}

function renderFullscreen(totalWidth, totalHeight) {
  const paneWidth = Math.max(totalWidth, MIN_PANE_WIDTH)
  const paneHeight = Math.max(totalHeight - 3, 3)
  const pane = panes[fullscreenPaneKey]
  return getPaneOutput(pane, paneWidth, paneHeight).slice(
    0,
    Math.max(totalHeight - 2, 0)
  )
}

function canRenderInteractiveUi() {
  return isInteractive && !uiRestored
}

function renderNow() {
  if (!canRenderInteractiveUi()) {
    return
  }

  lastRenderAt = Date.now()
  renderTimer = null

  const totalWidth = process.stdout.columns || 120
  const totalHeight = process.stdout.rows || 30
  const layout = getLayout(totalWidth)

  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)

  const rows =
    layout.mode === 'fullscreen'
      ? renderFullscreen(totalWidth, totalHeight)
      : layout.mode === 'stacked'
        ? renderStacked(totalWidth, totalHeight, layout.paneWidth)
        : renderColumns(totalWidth, totalHeight, layout.paneWidth)

  const frame = [
    ...rows,
    getStatusBar(totalWidth, layout.mode),
    getHelpBar(totalWidth),
  ].join('\n')

  process.stdout.write(`${frame}\n`)
}

function scheduleRender() {
  if (!canRenderInteractiveUi()) {
    return
  }

  if (renderTimer) {
    return
  }

  const delay = Math.max(RENDER_INTERVAL_MS - (Date.now() - lastRenderAt), 0)
  renderTimer = setTimeout(renderNow, delay)
}

// --- PROCESS LIFECYCLE ---

function getRunningProcessCount() {
  return processes.filter((child) => child.exitCode === null).length
}

function finalizeAndExit() {
  if (forceExitTimer) {
    clearTimeout(forceExitTimer)
    forceExitTimer = null
  }

  restoreInteractiveUi()
  process.exit(process.exitCode || 0)
}

function maybeFinalize() {
  if (closedProcessCount !== processes.length) {
    return
  }

  finalizeAndExit()
}

function killProcessTree(child, signal = 'SIGTERM') {
  if (child.exitCode !== null || child.killed) {
    return
  }

  if (isWindows) {
    const taskkill = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      stdio: 'ignore',
    })

    taskkill.on('error', () => {
      child.kill(signal)
    })

    return
  }

  try {
    process.kill(-child.pid, signal)
  } catch {
    child.kill(signal)
  }
}

function fallbackWrite(name, source, chunk) {
  const label = source === 'err' ? 'ERR' : 'OUT'
  const output = stripAnsi(chunk.toString())
  const lines = output.split(/\r?\n/)

  lines.forEach((line, index) => {
    const isLastEmptyLine = index === lines.length - 1 && line === ''

    if (!isLastEmptyLine) {
      process.stdout.write(`[${name} ${label}] ${line}\n`)
    }
  })
}

function spawnProcess(name, workspaceName) {
  const pane = panes[name]
  const child = spawn(
    npmCommand,
    ['run', 'dev', '--workspace', workspaceName],
    {
      cwd: rootDir,
      stdio: ['inherit', 'pipe', 'pipe'],
      detached: !isWindows,
    }
  )

  child.stdout.on('data', (chunk) => {
    if (canRenderInteractiveUi()) {
      consumeStream(pane, 'partialStdout', 'out', chunk)
      return
    }

    fallbackWrite(name, 'out', chunk)
  })

  child.stderr.on('data', (chunk) => {
    if (canRenderInteractiveUi()) {
      consumeStream(pane, 'partialStderr', 'err', chunk)
      return
    }

    fallbackWrite(name, 'err', chunk)
  })

  child.on('exit', (code, signal) => {
    const exitDescription =
      code !== null ? `code ${code}` : `signal ${signal || 'unknown'}`

    pane.exited = true
    pane.exitCode = code
    pane.signal = signal

    if (canRenderInteractiveUi()) {
      flushBuffer(pane, 'partialStdout', 'out')
      flushBuffer(pane, 'partialStderr', 'err')
      appendLine(
        pane,
        `process exited with ${exitDescription}`,
        code === 0 ? 'out' : 'err'
      )
      scheduleRender()
    } else {
      process.stdout.write(`[${name}] stopped (${exitDescription})\n`)
    }

    closedProcessCount += 1

    if (code !== 0) {
      process.exitCode = process.exitCode || code || 1

      if (isShuttingDown) {
        maybeFinalize()
        return
      }

      requestShutdown(process.exitCode)
      return
    }

    maybeFinalize()
  })

  processes.push(child)
}

// --- KEYBOARD CONTROLS ---

function getActivePane() {
  return panes[activePaneKey]
}

function cycleActivePane() {
  const currentIndex = paneOrder.indexOf(activePaneKey)
  activePaneKey = paneOrder[(currentIndex + 1) % paneOrder.length]
}

function scrollPane(pane, delta) {
  const nextOffset = pane.scrollOffset + delta
  pane.scrollOffset = Math.max(nextOffset, 0)
}

function scrollToTail(pane) {
  pane.scrollOffset = 0
}

function toggleFullscreen() {
  fullscreenPaneKey = fullscreenPaneKey ? null : activePaneKey
}

function requestShutdown(exitCode = process.exitCode || 0) {
  const now = Date.now()

  if (now - lastShutdownRequestAt < 250) {
    return
  }

  lastShutdownRequestAt = now
  process.exitCode = exitCode

  if (isShuttingDown) {
    process.stdout.write('Force exiting...\n')
    finalizeAndExit()
    return
  }

  shutdown()
}

function handleKeypress(_, key = {}) {
  const activePane = getActivePane()
  const input = key.sequence || ''

  if (key.ctrl && key.name === 'c') {
    requestShutdown(130)
    return
  }

  if (key.name === 'tab') {
    cycleActivePane()
    renderNow()
    return
  }

  if (key.name === 'return' || key.name === 'enter') {
    toggleFullscreen()
    renderNow()
    return
  }

  if (key.name === 'escape') {
    if (fullscreenPaneKey) {
      fullscreenPaneKey = null
      renderNow()
    }
    return
  }

  if (key.name === 'up' || input === 'k') {
    scrollPane(activePane, 1)
    renderNow()
    return
  }

  if (key.name === 'down' || input === 'j') {
    scrollPane(activePane, -1)
    renderNow()
    return
  }

  if (key.name === 'pageup') {
    scrollPane(activePane, 10)
    renderNow()
    return
  }

  if (key.name === 'pagedown') {
    scrollPane(activePane, -10)
    renderNow()
    return
  }

  if (input === 'g') {
    scrollPane(activePane, MAX_BUFFERED_LINES)
    renderNow()
    return
  }

  if (input === 'G' || key.name === 'end') {
    scrollToTail(activePane)
    renderNow()
  }
}

// --- STARTUP + SHUTDOWN UI ---

function shutdown() {
  if (isShuttingDown) {
    return
  }

  isShuttingDown = true

  restoreInteractiveUi()
  process.stdout.write('Shutting down dev processes...\n')

  if (renderTimer) {
    clearTimeout(renderTimer)
    renderTimer = null
  }

  process.exitCode = process.exitCode || 0

  forceExitTimer = setTimeout(() => {
    process.stdout.write('Forcing remaining dev processes to exit...\n')
    processes.forEach((child) => {
      if (child.exitCode === null) {
        killProcessTree(child, 'SIGKILL')
      }
    })
    finalizeAndExit()
  }, FORCE_KILL_TIMEOUT_MS)

  processes.forEach((child) => {
    if (child.exitCode === null && !child.killed) {
      killProcessTree(child, 'SIGTERM')
    }
  })

  if (getRunningProcessCount() === 0) {
    finalizeAndExit()
  }
}

function printStartupBanner() {
  startTime = new Date()
  const message = `blogapp dev launcher v1.0.0 starting at ${startTime.toLocaleTimeString()}`

  process.stdout.write(`${message}\n`)
  process.stdout.write('Entering interactive log view...\n')
}

function setupInteractiveUi() {
  if (!isInteractive) {
    return
  }

  readline.emitKeypressEvents(process.stdin)
  process.stdout.write('\x1b[?1049h')
  process.stdout.write('\x1b[?25l')
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.on('keypress', handleKeypress)
}

function restoreInteractiveUi() {
  if (!isInteractive || uiRestored) {
    return
  }

  uiRestored = true

  if (renderTimer) {
    clearTimeout(renderTimer)
    renderTimer = null
  }

  process.stdin.off('keypress', handleKeypress)
  if (typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(false)
  }
  process.stdin.pause()
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
  process.stdout.write('\x1b[?25h')
  process.stdout.write('\x1b[?1049l')
}

// --- BOOTSTRAP ---

process.on('SIGINT', () => requestShutdown(130))
process.on('SIGTERM', () => requestShutdown(143))
process.on('exit', restoreInteractiveUi)
process.stdout.on('resize', scheduleRender)

printStartupBanner()
setupInteractiveUi()

spawnProcess('server', '@blogapp/server')
spawnProcess('client', '@blogapp/client')

renderNow()
