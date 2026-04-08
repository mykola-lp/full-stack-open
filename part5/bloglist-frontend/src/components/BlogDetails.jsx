const BlogDetails = ({ blog, handleLike, handleDelete, user }) => {
  if (!blog) {
    return <div>blog not found</div>
  }

  return (
    <div className="blog-details-view">
      <h2>{blog.title} {blog.author}</h2>

      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>

      <div className="blog-likes">
        likes {blog.likes}
        {' '}
        {user && (
          <button onClick={() => handleLike(blog)}>
            like
          </button>
        )}
      </div>

      <div>added by {blog.user?.name}</div>

      {blog.user?.username === user?.username && (
        <button onClick={() => handleDelete(blog)}>
          remove
        </button>
      )}
    </div>
  )
}

export default BlogDetails
