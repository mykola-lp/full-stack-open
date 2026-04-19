import { notificationStateActions } from '../state'

let timeoutId

export const showNotification = (
  message,
  isError = false,
  duration = 5000
) => {
  if (timeoutId) {
    window.clearTimeout(timeoutId)
  }

  notificationStateActions.setNotification(message, isError)

  timeoutId = window.setTimeout(() => {
    notificationStateActions.clearNotification()
  }, duration)
}
