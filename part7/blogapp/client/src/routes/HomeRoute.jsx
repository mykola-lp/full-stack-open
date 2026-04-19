import BlogList from '../features/blogs/components/BlogList'
import { useBlogs } from '../features/blogs/state'

const HomeRoute = () => {
  const blogs = useBlogs()

  return <BlogList blogs={blogs} />
}

export default HomeRoute
