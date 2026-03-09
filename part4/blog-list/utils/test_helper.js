const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'John',
    url: 'http://example.com',
    likes: 5,
    user: null
  },
  {
    title: 'Second blog',
    author: 'Mike',
    url: 'http://test.com',
    likes: 2,
    user: null
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}