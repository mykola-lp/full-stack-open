import blogsApi from '../api/blogsApi'
import { blogStateActions } from '../state'
import { showNotification } from '../../../shared/services/notificationService'

export const fetchBlogs = async () => {
  blogStateActions.setLoading(true)

  try {
    const blogs = await blogsApi.getAll()
    blogStateActions.setBlogs(blogs)
  } catch (error) {
    showNotification('failed to load blogs', true)
    console.error('Loading blogs failed:', error)
  } finally {
    blogStateActions.setLoading(false)
  }
}

export const createBlog = async (blogData) => {
  try {
    const createdBlog = await blogsApi.create(blogData)

    blogStateActions.addBlog(createdBlog)
    showNotification(
      `a new blog ${createdBlog.title} by ${createdBlog.author} added`
    )

    return createdBlog
  } catch (error) {
    showNotification('creating new blog failed', true)
    console.error('Creating new blog failed:', error)
    return null
  }
}

export const likeBlog = async (blog) => {
  const updatedPayload = {
    ...blog,
    likes: blog.likes + 1,
    user: blog.user.id,
  }

  try {
    const updatedBlog = await blogsApi.update(updatedPayload)

    blogStateActions.replaceBlog(updatedBlog)

    return updatedBlog
  } catch (error) {
    showNotification('failed to update likes', true)
    console.error('Error while trying to like a blog:', error)
    return null
  }
}

export const addComment = async (blog, comment) => {
  try {
    const updatedBlog = await blogsApi.addComment(blog.id, comment)

    blogStateActions.replaceBlog(updatedBlog)

    return updatedBlog
  } catch (error) {
    showNotification('failed to add comment', true)
    console.error('Error while trying to add a comment:', error)
    return null
  }
}

export const removeBlog = async (blog) => {
  try {
    await blogsApi.remove(blog.id)

    blogStateActions.removeBlog(blog.id)
    showNotification(`Blog ${blog.title} by ${blog.author} removed`)

    return true
  } catch (error) {
    showNotification('failed to delete blog', true)
    console.error('Error while trying to delete a blog:', error)
    return false
  }
}
