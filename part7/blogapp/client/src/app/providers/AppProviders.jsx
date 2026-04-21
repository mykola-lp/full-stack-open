import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { useDispatch } from 'react-redux'

import { initializeAuth } from '../../features/auth/authSlice'
import { store } from '../store'

const queryClient = new QueryClient()

const StoreBootstrap = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  return children
}

export const AppProviders = ({ children }) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <StoreBootstrap>{children}</StoreBootstrap>
    </QueryClientProvider>
  </Provider>
)
