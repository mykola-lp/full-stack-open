import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import authApi from './api/authApi'
import blogsApi from '../blogs/api/blogsApi'
import { showNotification } from '../notification/notificationSlice'
import { getUser, removeUser, saveUser } from '../../services/persistentUser'

const initialState = {
  user: null,
}

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async () => {
    const storedUser = getUser()

    if (storedUser) {
      blogsApi.setToken(storedUser.token)
    }

    return storedUser
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const authenticatedUser = await authApi.login(credentials)

      saveUser(authenticatedUser)
      blogsApi.setToken(authenticatedUser.token)

      return authenticatedUser
    } catch (error) {
      dispatch(showNotification('wrong username or password', true))
      console.error('Login failed:', error)
      return rejectWithValue(error.response?.data ?? null)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      removeUser()
      blogsApi.setToken(null)
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { logoutUser } = authSlice.actions

export const selectUser = (state) => state.auth.user

export default authSlice.reducer
