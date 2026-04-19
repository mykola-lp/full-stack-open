const loginRouter = require('express').Router()

const { authenticateUser } = require('./service')

loginRouter.post('/', async (request, response) => {
  const authResult = await authenticateUser(request.body)

  if (!authResult) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  response.status(200).send(authResult)
})

module.exports = loginRouter
