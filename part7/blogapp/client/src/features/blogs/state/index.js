import { useBlogStore } from './zustand/blogStore'

export const useBlogsState = useBlogStore

export const useBlogs = () => useBlogStore((state) => state.blogs)

export const useBlogsLoading = () => useBlogStore((state) => state.isLoading)

export const useBlogById = (id) =>
  useBlogStore((state) => state.blogs.find((blog) => blog.id === id) ?? null)

export const blogStateActions = {
  addBlog: (blog) => useBlogStore.getState().addBlog(blog),
  removeBlog: (id) => useBlogStore.getState().removeBlog(id),
  replaceBlog: (blog) => useBlogStore.getState().replaceBlog(blog),
  setBlogs: (blogs) => useBlogStore.getState().setBlogs(blogs),
  setLoading: (isLoading) => useBlogStore.getState().setLoading(isLoading),
}
