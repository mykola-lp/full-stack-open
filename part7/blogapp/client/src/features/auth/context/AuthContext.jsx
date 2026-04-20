import { createContext, useContext, useEffect, useState } from 'react'

import authApi from '../api/authApi'
import blogsApi from '../../blogs/api/blogsApi'
import { getUser, removeUser, saveUser } from '../../../services/persistentUser'
import { useNotificationContext } from '../../../shared/context/NotificationContext'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const { showNotification } = useNotificationContext()

  useEffect(() => {
    const storedUser = getUser()

    if (!storedUser) {
      return
    }

    blogsApi.setToken(storedUser.token)
    setUser(storedUser)
  }, [])

  const login = async (credentials) => {
    try {
      const authenticatedUser = await authApi.login(credentials)

      saveUser(authenticatedUser)
      blogsApi.setToken(authenticatedUser.token)
      setUser(authenticatedUser)

      return true
    } catch (error) {
      showNotification('wrong username or password', true)
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    removeUser()
    blogsApi.setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
