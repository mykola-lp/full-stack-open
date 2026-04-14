const http = require('http')
const { Server } = require('socket.io')

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: config.IS_PRODUCTION ? undefined : 'http://localhost:5173',
  },
})

io.on('connection', socket => {
  logger.info(`Socket connected: ${socket.id}`)

  socket.emit('server:ready', {
    message: 'socket connection established',
    time: new Date().toISOString(),
  })

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`)
  })
})

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
