const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// GET /api/users — перегляд всіх користувачів
usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({})
      .populate('blogs', { title: 1, url: 1, likes: 1 })

    res.json(users)
  } catch (error) {
    next(error)
  }
})

// POST /api/users
usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'username must be at least 3 characters long' })
    }

    if (!password || password.length < 3) {
      return res.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: 'username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
