import BlogList from '../features/blogs/components/BlogList'
import { useBlogsQuery } from '../features/blogs/hooks/useBlogsQuery'

const HomeRoute = () => {
  const { data: blogs = [] } = useBlogsQuery()

  return <BlogList blogs={blogs} />
}

export default HomeRoute
