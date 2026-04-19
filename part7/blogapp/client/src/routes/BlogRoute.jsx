import { useNavigate, useParams } from 'react-router-dom'

import BlogCard from '../features/blogs/components/BlogCard'
import { useCurrentUser } from '../features/auth/state'
import {
  addComment,
  likeBlog,
  removeBlog,
} from '../features/blogs/services/blogService'
import { useBlogById } from '../features/blogs/state'

const BlogRoute = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useCurrentUser()
  const blog = useBlogById(id)

  const handleRemove = async (blogToRemove) => {
    const removed = await removeBlog(blogToRemove)

    if (removed) {
      navigate('/')
    }
  }

  return (
    <BlogCard
      blog={blog}
      addLike={likeBlog}
      addComment={addComment}
      currentUser={user}
      removeBlog={handleRemove}
    />
  )
}

export default BlogRoute
