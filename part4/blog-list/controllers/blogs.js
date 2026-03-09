const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET /api/blogs
blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({})
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
      return res.status(400).end()
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    })

    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
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
    )

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
