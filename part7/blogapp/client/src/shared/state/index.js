import { useNotificationStore } from './zustand/notificationStore'

export const useNotificationState = useNotificationStore

export const useNotification = () =>
  useNotificationStore((state) => state.notification)

export const notificationStateActions = {
  clearNotification: () => useNotificationStore.getState().clearNotification(),
  setNotification: (message, isError = false) =>
    useNotificationStore.getState().setNotification(message, isError),
}
