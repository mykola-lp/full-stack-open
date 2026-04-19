import { useAuthStore } from './zustand/authStore'

export const useAuthState = useAuthStore

export const useCurrentUser = () => useAuthStore((state) => state.user)

export const authStateActions = {
  clearUser: () => useAuthStore.getState().clearUser(),
  setUser: (user) => useAuthStore.getState().setUser(user),
}
