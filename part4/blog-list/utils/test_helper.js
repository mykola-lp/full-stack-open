const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'John',
    url: 'http://example.com',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Mike',
    url: 'http://test.com',
    likes: 2
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb
}