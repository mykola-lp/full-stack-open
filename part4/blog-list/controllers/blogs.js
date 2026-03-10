const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

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

blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(400).json({ error: 'invalid user' })
    }

    const body = req.body

    if (!body.title || !body.url) {
      return res.status(400).json({ error: 'title or url missing' })
    }

    const likes = body.likes || 0

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
    res.status(201).json(populatedBlog)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/blogs/:id
blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({ error: 'invalid user' })
    }

    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return res.status(401).json({ error: 'only creator can delete blog' })
    }

    await Blog.findByIdAndDelete(req.params.id)

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