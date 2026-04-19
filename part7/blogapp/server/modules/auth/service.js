const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../../config')
const { model: User } = require('../users')

const authenticateUser = async ({ username, password }) => {
  const user = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return null
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, config.SECRET)

  return {
    token,
    username: user.username,
    name: user.name,
  }
}

module.exports = {
  authenticateUser,
}
