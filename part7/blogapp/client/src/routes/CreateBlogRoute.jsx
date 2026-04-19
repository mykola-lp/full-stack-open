import { useNavigate } from 'react-router-dom'

import BlogForm from '../features/blogs/components/BlogForm'
import { createBlog } from '../features/blogs/services/blogService'

const CreateBlogRoute = () => {
  const navigate = useNavigate()

  const handleCreateBlog = async (blogData) => {
    const created = await createBlog(blogData)

    if (created) {
      navigate('/')
    }
  }

  return <BlogForm createBlog={handleCreateBlog} />
}

export default CreateBlogRoute
