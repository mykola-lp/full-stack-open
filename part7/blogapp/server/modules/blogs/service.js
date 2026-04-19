const Blog = require('./model')

const BLOG_POPULATE_FIELDS = {
  path: 'user',
  select: { username: 1, name: 1, id: 1 },
}

const getAllBlogs = async () =>
  Blog.find({}).populate(BLOG_POPULATE_FIELDS.path, BLOG_POPULATE_FIELDS.select)

const createBlog = async (blogData, user) => {
  const blog = new Blog({
    ...blogData,
    comments: blogData.comments ?? [],
    likes: blogData.likes ?? 0,
    user: user._id,
  })

  if (!blog.title || !blog.url) {
    return null
  }

  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  const savedBlog = await blog.save()

  return savedBlog.populate(
    BLOG_POPULATE_FIELDS.path,
    BLOG_POPULATE_FIELDS.select
  )
}

const deleteBlog = async (blogId, user) => {
  const blog = await Blog.findById(blogId)

  if (!blog) {
    return { status: 'not_found' }
  }

  if (user.id.toString() !== blog.user.toString()) {
    return { status: 'forbidden' }
  }

  user.blogs = user.blogs.filter(
    (savedBlogId) => savedBlogId.toString() !== blog.id.toString()
  )

  await user.save()
  await blog.deleteOne()

  return { status: 'deleted' }
}

const updateBlog = async (blogId, payload) => {
  const blog = await Blog.findById(blogId)

  if (!blog) {
    return null
  }

  blog.title = payload.title
  blog.author = payload.author
  blog.url = payload.url
  blog.likes = payload.likes

  const updatedBlog = await blog.save()

  return updatedBlog.populate(
    BLOG_POPULATE_FIELDS.path,
    BLOG_POPULATE_FIELDS.select
  )
}

const addComment = async (blogId, comment) => {
  const blog = await Blog.findById(blogId)

  if (!blog) {
    return null
  }

  blog.comments = blog.comments.concat(comment)

  const updatedBlog = await blog.save()

  return updatedBlog.populate(
    BLOG_POPULATE_FIELDS.path,
    BLOG_POPULATE_FIELDS.select
  )
}

module.exports = {
  addComment,
  createBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
}
