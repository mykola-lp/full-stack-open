import { lazy, Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material'

import ErrorBoundary from './shared/components/ErrorBoundary'
import NotFound from './shared/components/NotFound'
import Notification from './shared/components/Notification'
import { useAuth } from './features/auth/hooks/useAuth'
import socket from './shared/lib/socket'

const HomeRoute = lazy(() => import('./routes/HomeRoute'))
const BlogRoute = lazy(() => import('./routes/BlogRoute'))
const LoginRoute = lazy(() => import('./routes/LoginRoute'))
const CreateBlogRoute = lazy(() => import('./routes/CreateBlogRoute'))
const UserRoute = lazy(() => import('./routes/UserRoute'))
const UserDetailRoute = lazy(() => import('./routes/UserDetailRoute'))

const App = () => {
  const { logout, user } = useAuth()
  const notification = useSelector((state) => state.notification)
  const navigate = useNavigate()

  useEffect(() => {
    const handleServerReady = (payload) => {
      console.log('Socket event received:', payload)
    }

    socket.on('server:ready', handleServerReady)

    return () => {
      socket.off('server:ready', handleServerReady)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            blogs
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/users"
            sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            users
          </Button>
          {!user ? (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
            >
              login
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                new blog
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <ErrorBoundary>
        <Suspense
          fallback={
            <Box
              sx={{
                minHeight: 240,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/blogs/:id" element={<BlogRoute />} />
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/create" element={<CreateBlogRoute />} />
            <Route path="/users" element={<UserRoute />} />
            <Route path="/users/:id" element={<UserDetailRoute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Container>
  )
}

export default App
