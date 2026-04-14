const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const usersRouter = require('./controllers/users')

const config = require('./utils/config')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

if (config.IS_TEST) {
  app.use('/api/testing', testingRouter)
}

if (config.IS_PRODUCTION) {
  app.use(express.static(config.CLIENT_DIST_PATH))

  app.get('/*splat', (request, response) => {
    response.sendFile(path.join(config.CLIENT_DIST_PATH, 'index.html'))
  })
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
