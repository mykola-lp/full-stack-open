import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  notification: { message: null, isError: false },
  clearNotification: () =>
    set({ notification: { message: null, isError: false } }),
  setNotification: (message, isError = false) =>
    set({ notification: { message, isError } }),
}))
