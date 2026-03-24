let timeoutId

export const setNotificationWithTimeout = (dispatch, message, seconds = 5) => {
  dispatch({ type: 'SET_NOTIFICATION', payload: message })

  if (timeoutId) clearTimeout(timeoutId)

  timeoutId = setTimeout(() => {
    dispatch({ type: 'CLEAR_NOTIFICATION' })
  }, seconds * 1000)
}