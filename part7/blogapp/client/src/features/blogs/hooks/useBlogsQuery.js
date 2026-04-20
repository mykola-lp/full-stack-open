import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import blogsApi from '../api/blogsApi'
import { useNotificationContext } from '../../../shared/context/NotificationContext'

const BLOGS_QUERY_KEY = ['blogs']

const sortBlogsByLikes = (blogs) => blogs.toSorted((a, b) => b.likes - a.likes)

const replaceBlog = (blogs, updatedBlog) =>
  sortBlogsByLikes(
    blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
  )

export const useBlogsQuery = () =>
  useQuery({
    queryFn: blogsApi.getAll,
    queryKey: BLOGS_QUERY_KEY,
    select: sortBlogsByLikes,
  })

export const useBlogById = (id) => {
  const query = useBlogsQuery()

  return {
    ...query,
    blog: query.data?.find((blog) => blog.id === id) ?? null,
  }
}

export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotificationContext()

  return useMutation({
    mutationFn: blogsApi.create,
    onError: (error) => {
      showNotification('creating new blog failed', true)
      console.error('Creating new blog failed:', error)
    },
    onSuccess: (createdBlog) => {
      queryClient.setQueryData(BLOGS_QUERY_KEY, (blogs = []) =>
        sortBlogsByLikes(blogs.concat(createdBlog))
      )
      showNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`
      )
    },
  })
}

export const useLikeBlogMutation = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotificationContext()

  return useMutation({
    mutationFn: (blog) =>
      blogsApi.update({
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id,
      }),
    onError: (error) => {
      showNotification('failed to update likes', true)
      console.error('Error while trying to like a blog:', error)
    },
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(BLOGS_QUERY_KEY, (blogs = []) =>
        replaceBlog(blogs, updatedBlog)
      )
    },
  })
}

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotificationContext()

  return useMutation({
    mutationFn: ({ blog, comment }) => blogsApi.addComment(blog.id, comment),
    onError: (error) => {
      showNotification('failed to add comment', true)
      console.error('Error while trying to add a comment:', error)
    },
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(BLOGS_QUERY_KEY, (blogs = []) =>
        replaceBlog(blogs, updatedBlog)
      )
    },
  })
}

export const useRemoveBlogMutation = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotificationContext()

  return useMutation({
    mutationFn: async (blog) => {
      await blogsApi.remove(blog.id)
      return blog
    },
    onError: (error) => {
      showNotification('failed to delete blog', true)
      console.error('Error while trying to delete a blog:', error)
    },
    onSuccess: (deletedBlog) => {
      queryClient.setQueryData(BLOGS_QUERY_KEY, (blogs = []) =>
        blogs.filter((blog) => blog.id !== deletedBlog.id)
      )
      showNotification(`Blog ${deletedBlog.title} by ${deletedBlog.author} removed`)
    },
  })
}
