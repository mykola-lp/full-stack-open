import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-title-author">
        {blog.title} {blog.author}

        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className="blog-details">
          <div className="blog-url">
            {blog.url}
          </div>

          <div className="blog-likes">
            likes {blog.likes}
            <button onClick={() => handleLike(blog)}>
              like
            </button>
          </div>

          <div className="blog-user">
            {blog.user?.name}
          </div>

          {blog.user?.username === user?.username && (
            <button onClick={() => handleDelete(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog