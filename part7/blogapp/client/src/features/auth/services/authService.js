import authApi from '../api/authApi'
import blogsApi from '../../blogs/api/blogsApi'
import { showNotification } from '../../../shared/services/notificationService'
import { getUser, removeUser, saveUser } from '../../../services/persistentUser'
import { authStateActions } from '../state'

const setAuthenticatedUser = (user) => {
  blogsApi.setToken(user.token)
  authStateActions.setUser(user)
}

export const initializeAuth = () => {
  const storedUser = getUser()

  if (!storedUser) {
    return
  }

  setAuthenticatedUser(storedUser)
}

export const login = async (credentials) => {
  try {
    const user = await authApi.login(credentials)

    saveUser(user)
    setAuthenticatedUser(user)

    return true
  } catch (error) {
    showNotification('wrong username or password', true)
    console.error('Login failed:', error)
    return false
  }
}

export const logout = () => {
  removeUser()
  blogsApi.setToken(null)
  authStateActions.clearUser()
}
