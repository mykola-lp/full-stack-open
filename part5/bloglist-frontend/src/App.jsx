import { useState, useEffect } from 'react'
import { Link, Navigate, Route, Routes, useMatch, useNavigate } from 'react-router-dom'

import blogService from './services/blogs'
import loginService from './services/login'

import BlogDetails from './components/BlogDetails'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()
  const blogMatch = useMatch('/blogs/:id')

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs( blogs ))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      navigate('/')
    } catch {
      setNotification({
        text: 'wrong username or password',
        type: 'error'
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      setNotification({
        text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        type: 'success'
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)

      navigate('/')
    } catch {
      setNotification({
        text: 'error creating blog',
        type: 'error'
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    setBlogs(blogs.map(b =>
      b.id === blog.id
        ? { ...returnedBlog, user: blog.user }
        : b
    ))
  }

  const handleDelete = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )

    if (!confirmDelete) return

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      navigate('/')
    } catch {
      setNotification({
        text: 'error deleting blog',
        type: 'error'
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const blog = blogMatch
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null

  return (
    <div>
      <Notification message={notification} />

      <nav>
        <Link to="/">blogs</Link>
        {' '}
        <Link to="/login">login</Link>
        {' '}
        {user && (
          <>
            <Link to="/create">new blog</Link>
            {' '}
            <span>{user.name} logged in</span>
            {' '}
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>blogs</h2>

              <ul>
                {[...blogs]
                  .sort((a, b) => b.likes - a.likes)
                  .map(blog => (
                    <li key={blog.id}>
                      <Link to={`/blogs/${blog.id}`}>
                        {blog.title} {blog.author}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogDetails
              blog={blog}
              handleLike={handleLike}
              handleDelete={handleDelete}
              user={user}
            />
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : (
            <div>
              <h2>log in to application</h2>
              <LoginForm handleLogin={handleLogin} />
            </div>
          )}
        />
        <Route
          path="/create"
          element={user ? (
            <div>
              <h2>create new</h2>
              <BlogForm createBlog={createBlog} />
            </div>
          ) : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  )
}

export default App
