import { createContext, useContext, useEffect, useRef, useState } from 'react'

const NotificationContext = createContext(null)

const initialNotification = { message: null, isError: false }

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(initialNotification)
  const timeoutRef = useRef(null)

  const clearNotification = () => {
    setNotification(initialNotification)
  }

  const showNotification = (message, isError = false, duration = 5000) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    setNotification({ message, isError })

    timeoutRef.current = window.setTimeout(() => {
      clearNotification()
    }, duration)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{ clearNotification, notification, showNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error(
      'useNotificationContext must be used within NotificationProvider'
    )
  }

  return context
}
