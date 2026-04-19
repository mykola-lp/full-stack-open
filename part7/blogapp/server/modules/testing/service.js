const { model: Blog } = require('../blogs')
const { model: User } = require('../users')

const resetDatabase = async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
}

module.exports = {
  resetDatabase,
}
