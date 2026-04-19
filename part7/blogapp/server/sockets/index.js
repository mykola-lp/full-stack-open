const { Server } = require('socket.io')

const config = require('../config')
const logger = require('../shared/logger')

const registerSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.IS_PRODUCTION ? undefined : 'http://localhost:5173',
    },
  })

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`)

    socket.emit('server:ready', {
      message: 'socket connection established',
      time: new Date().toISOString(),
    })

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`)
    })
  })

  return io
}

module.exports = {
  registerSocketServer,
}
