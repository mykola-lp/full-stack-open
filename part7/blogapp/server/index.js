const http = require('http')

const app = require('./app')
const config = require('./config')
const logger = require('./shared/logger')
const { registerSocketServer } = require('./sockets')

const server = http.createServer(app)

registerSocketServer(server)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
