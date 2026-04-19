const blogsRouter = require('express').Router()

const { userExtractor } = require('../../middleware')
const {
  addComment,
  createBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
} = require('./service')

blogsRouter.get('/', async (request, response) => {
  const blogs = await getAllBlogs()
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const savedBlog = await createBlog(request.body, request.user)

  if (!savedBlog) {
    return response.status(400).send({ error: 'title or url missing' })
  }

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const result = await deleteBlog(request.params.id, request.user)

  if (result.status === 'not_found') {
    return response.status(204).end()
  }

  if (result.status === 'forbidden') {
    return response.status(403).json({ error: 'user not authorized' })
  }

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await updateBlog(request.params.id, request.body)

  if (!updatedBlog) {
    return response.status(404).end()
  }

  response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body

  if (!comment || !comment.trim()) {
    return response.status(400).json({ error: 'comment is required' })
  }

  const updatedBlog = await addComment(request.params.id, comment.trim())

  if (!updatedBlog) {
    return response.status(404).end()
  }

  response.status(201).json(updatedBlog)
})

module.exports = blogsRouter
