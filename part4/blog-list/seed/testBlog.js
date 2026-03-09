const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

mongoose.set('debug', (collection, method, query, doc) => {
  console.log(
    `MongoDB ${collection}.${method}`,
    JSON.stringify(query),
    JSON.stringify(doc)
  )
})

async function run() {
  try {
    await mongoose.connect(config.MONGODB_URI)
    console.log('Connected to MongoDB')

    let user = await User.findOne({ username: 'testuser' })

    if (!user) {
      user = new User({
        username: 'testuser',
        name: 'Test User',
        passwordHash: 'hash_for_testing',
        blogs: []
      })

      user = await user.save()
      console.log('Created new user:', user.toJSON())
    } else {
      console.log('Found existing user:', user.toJSON())
    }

    const blog = new Blog({
      title: 'Test blog',
      author: 'Me',
      url: 'test.com',
      likes: 3,
      user: user._id
    })

    const savedBlog = await blog.save()

    console.log('\nSaved blog (raw):', savedBlog)
    console.log('\nSaved blog (JSON):', savedBlog.toJSON())

    user.blogs.push(savedBlog._id)
    await user.save()

    console.log('\nUpdated user with new blog:', await User.findById(user._id).populate('blogs'))
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    mongoose.connection.close()
  }
}

run() // node testBlog.js
