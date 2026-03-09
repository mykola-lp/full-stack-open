// seedUsers.js
const mongoose = require('mongoose')
const User = require('../models/user')
const config = require('../utils/config')
const bcrypt = require('bcrypt')

mongoose.set('debug', (collection, method, query, doc) => {
  console.log(
    `MongoDB ${collection}.${method}`,
    JSON.stringify(query),
    JSON.stringify(doc)
  )
})

async function createUser({ username, password, name }) {
  let user = await User.findOne({ username })

  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10)

    user = new User({
      username,
      name,
      passwordHash,
      blogs: []
    })

    user = await user.save()
    console.log('Created new user:', user.toJSON())
  } else {
    console.log('Found existing user:', user.toJSON())
  }

  return user
}

async function run() {
  try {
    await mongoose.connect(config.MONGODB_URI)

    console.log('Connected to MongoDB')

    const users = [
      { username: 'testuser', password: 'secret', name: 'Test User' },
      { username: 'testuser2', password: 'secret2', name: 'Test User 2' },
    ]

    for (const u of users) {
      await createUser(u)
    }

  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    mongoose.connection.close()
  }
}

run() // node seedUsers.js
