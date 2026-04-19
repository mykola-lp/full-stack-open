const usersRouter = require('express').Router()

const { createUser, getAllUsers } = require('./service')

usersRouter.get('/', async (request, response) => {
  const users = await getAllUsers()
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const result = await createUser(request.body)

  if (result.error) {
    return response.status(400).json({
      error: result.error,
    })
  }

  response.status(201).json(result.user)
})

module.exports = usersRouter
