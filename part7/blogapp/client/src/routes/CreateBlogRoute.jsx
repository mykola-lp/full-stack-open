import { useNavigate } from 'react-router-dom'

import BlogForm from '../features/blogs/components/BlogForm'
import { useCreateBlogMutation } from '../features/blogs/hooks/useBlogsQuery'

const CreateBlogRoute = () => {
  const navigate = useNavigate()
  const createBlogMutation = useCreateBlogMutation()

  const handleCreateBlog = async (blogData) => {
    const created = await createBlogMutation.mutateAsync(blogData)

    if (created) {
      navigate('/')
    }
  }

  return <BlogForm createBlog={handleCreateBlog} />
}

export default CreateBlogRoute
