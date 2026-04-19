import { create } from 'zustand'

const sortBlogsByLikes = (blogs) => blogs.toSorted((a, b) => b.likes - a.likes)

export const useBlogStore = create((set) => ({
  blogs: [],
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  setBlogs: (blogs) => set({ blogs: sortBlogsByLikes(blogs) }),
  addBlog: (blog) =>
    set((state) => ({
      blogs: sortBlogsByLikes(state.blogs.concat(blog)),
    })),
  replaceBlog: (updatedBlog) =>
    set((state) => ({
      blogs: sortBlogsByLikes(
        state.blogs.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog
        )
      ),
    })),
  removeBlog: (id) =>
    set((state) => ({
      blogs: state.blogs.filter((blog) => blog.id !== id),
    })),
}))
