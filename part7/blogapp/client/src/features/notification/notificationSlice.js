import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: null,
  isError: false,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotification: () => initialState,
    setNotification: (_, action) => action.payload,
  },
})

let timeoutId = null

export const { clearNotification, setNotification } = notificationSlice.actions

export const showNotification =
  (message, isError = false, duration = 5000) =>
  (dispatch) => {
    if (timeoutId) {
      window.clearTimeout(timeoutId)
    }

    dispatch(setNotification({ message, isError }))

    timeoutId = window.setTimeout(() => {
      dispatch(clearNotification())
      timeoutId = null
    }, duration)
  }

export default notificationSlice.reducer
