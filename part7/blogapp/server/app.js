const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const config = require('./config')
const middleware = require('./middleware')
const authModule = require('./modules/auth')
const blogsModule = require('./modules/blogs')
const testingModule = require('./modules/testing')
const usersModule = require('./modules/users')

const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsModule.router)
app.use('/api/login', authModule.router)
app.use('/api/users', usersModule.router)

if (config.IS_TEST) {
  app.use('/api/testing', testingModule.router)
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
