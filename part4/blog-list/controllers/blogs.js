const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// GET /api/blogs
blogsRouter.get('/', async (req, res, next) => {
  try {
    // Populate user info: username + name
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

// POST /api/blogs
blogsRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body

    if (!body.title || !body.url) {
      return res.status(400).json({ error: 'title or url missing' })
    }

    // If likes missing, default to 0
    const likes = body.likes || 0

    // Assume body.userId is provided in request (linked user)
    const user = await User.findById(body.userId)
    if (!user) {
      return res.status(400).json({ error: 'invalid user' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes,
      user: user._id
    })

    const savedBlog = await blog.save()

    // Update user's blogs array
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
    res.status(201).json(populatedBlog)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/blogs/:id
blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id)

    if (!deletedBlog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    // Remove blog from user's blogs array
    const user = await User.findById(deletedBlog.user)
    if (user) {
      user.blogs = user.blogs.filter(id => id.toString() !== deletedBlog._id.toString())
      await user.save()
    }

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

// PUT /api/blogs/:id
blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const body = req.body

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes: body.likes },
      { new: true, runValidators: true, context: 'query' }
    ).populate('user', { username: 1, name: 1 })

    if (updatedBlog) {
      res.json(updatedBlog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter