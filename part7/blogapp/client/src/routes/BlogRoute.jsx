import { useNavigate, useParams } from 'react-router-dom'

import BlogCard from '../features/blogs/components/BlogCard'
import { useAuth } from '../features/auth/hooks/useAuth'
import {
  useAddCommentMutation,
  useBlogById,
  useLikeBlogMutation,
  useRemoveBlogMutation,
} from '../features/blogs/hooks/useBlogsQuery'

const BlogRoute = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { blog } = useBlogById(id)
  const likeBlogMutation = useLikeBlogMutation()
  const addCommentMutation = useAddCommentMutation()
  const removeBlogMutation = useRemoveBlogMutation()

  const handleRemove = async (blogToRemove) => {
    await removeBlogMutation.mutateAsync(blogToRemove)
    navigate('/')
  }

  const handleLike = async (blogToLike) => {
    const updatedBlog = await likeBlogMutation.mutateAsync(blogToLike)

    if (updatedBlog) {
      return updatedBlog
    }
  }

  const handleAddComment = async (blogToComment, comment) => {
    const updatedBlog = await addCommentMutation.mutateAsync({
      blog: blogToComment,
      comment,
    })

    if (updatedBlog) {
      return updatedBlog
    }
  }

  return (
    <BlogCard
      blog={blog}
      addLike={handleLike}
      addComment={handleAddComment}
      currentUser={user}
      removeBlog={handleRemove}
    />
  )
}

export default BlogRoute
