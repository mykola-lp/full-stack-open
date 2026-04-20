import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AuthProvider } from '../../features/auth/context/AuthContext'
import { NotificationProvider } from '../../shared/context/NotificationContext'

const queryClient = new QueryClient()

export const AppProviders = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <AuthProvider>{children}</AuthProvider>
    </NotificationProvider>
  </QueryClientProvider>
)
