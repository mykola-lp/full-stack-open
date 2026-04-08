import { useState, useEffect } from 'react'
import { Link as RouterLink, Navigate, Route, Routes, useMatch, useNavigate } from 'react-router-dom'

import { Container, AppBar, Toolbar, Button, Box, Typography } from '@mui/material'

import blogService from './services/blogs'
import loginService from './services/login'

import BlogList from './components/BlogList'
import BlogDetails from './components/BlogDetails'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import AboutPage from './components/AboutPage'

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
    <Container>
      <div>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            mt: 2,
            borderRadius: 3,
            backgroundColor: '#8b735f',
          }}
        >
          <Toolbar sx={{ gap: 1.5, minHeight: 72 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              sx={{ color: '#ffffff', fontWeight: 600 }}
            >
              blogs
            </Button>
            {!user && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ color: '#ffffff', fontWeight: 600 }}
              >
                login
              </Button>
            )}
            <Button
              color="inherit"
              component={RouterLink}
              to="/about"
              sx={{ color: '#ffffff', fontWeight: 600 }}
            >
              about
            </Button>

            {user && (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/create"
                  sx={{ color: '#ffffff', fontWeight: 600 }}
                >
                  new blog
                </Button>

                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography sx={{ color: '#ffffff', fontWeight: 500 }}>
                    {user.name} logged in
                  </Typography>

                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    sx={{
                      color: '#ffffff',
                      borderColor: 'rgba(255, 255, 255, 0.55)',
                      '&:hover': {
                        borderColor: '#ffffff',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                    }}
                  >
                    logout
                  </Button>
                </Box>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Notification message={notification} />

        <Routes>
          <Route
            path="/"
            element={<BlogList blogs={blogs} />}
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
            path="/about"
            element={<AboutPage />}
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
    </Container>
  )
}

export default App
