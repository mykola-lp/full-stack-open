const bcrypt = require('bcrypt')

const User = require('./model')

const getAllUsers = async () =>
  User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    id: 1,
  })

const createUser = async ({ username, name, password }) => {
  if (!password || password.length < 3) {
    return {
      error: 'Password is required and its minimum length is 3 characters',
    }
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  return { user: savedUser }
}

module.exports = {
  createUser,
  getAllUsers,
}
