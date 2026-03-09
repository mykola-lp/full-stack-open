const mongoose = require('mongoose')
const Blog = require('../models/blog')
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

async function run() {
  try {
    await mongoose.connect(config.MONGODB_URI)
    console.log('Connected to MongoDB')

    // ======== User ========
    const username = 'testuser'
    const password = 'testpass'

    let user = await User.findOne({ username })

    if (!user) {
      const passwordHash = await bcrypt.hash(password, 10)

      user = new User({
        username,
        name: 'Test User',
        passwordHash,
        blogs: []
      })

      user = await user.save()
      console.log('Created new user:', user.toJSON())
    } else {
      console.log('Found existing user:', user.toJSON())
    }

    // ======== Blog ========
    const blogData = {
      title: 'Dynamic Test Blog',
      author: 'Seeder',
      url: 'http://example.com/blog',
      likes: Math.floor(Math.random() * 10),
      user: user._id
    }

    const blog = new Blog(blogData)
    const savedBlog = await blog.save()

    console.log('\nSaved blog (JSON):', savedBlog.toJSON())

    // ======== Update user's blogs array ========
    user.blogs.push(savedBlog._id)
    await user.save()

    const populatedUser = await User.findById(user._id).populate('blogs')
    console.log('\nUser with populated blogs:', populatedUser.toJSON())

    console.log('\n✅ Seeder finished successfully!')

  } catch (err) {
    console.error('Error in seeding script:', err)
  } finally {
    mongoose.connection.close()
  }
}

run() // node seed/testBlog.js
