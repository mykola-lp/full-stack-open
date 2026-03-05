const mongoose = require('mongoose')
const Blog = require('./models/blog')
const config = require('./utils/config')

// mongoose.set('debug', true)

mongoose.set('debug', (collection, method, query, doc) => {
  console.log(
    `MongoDB ${collection}.${method}`,
    JSON.stringify(query),
    JSON.stringify(doc)
  )
})

mongoose.connect(config.MONGODB_URI)

async function run() {

  const blog = new Blog({
    title: 'Test blog',
    author: 'Me',
    url: 'test.com',
    likes: 3
  })

  const saved = await blog.save()

  console.log('\nSaved document:')
  console.log(saved)

  console.log('\nJSON version:')
  console.log(saved.toJSON())

  mongoose.connection.close()
}

run() // node testBlog.js
