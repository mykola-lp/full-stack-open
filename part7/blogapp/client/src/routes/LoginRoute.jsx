import { useNavigate } from 'react-router-dom'

import { useAuth } from '../features/auth/hooks/useAuth'
import LoginForm from '../features/auth/components/LoginForm'

const LoginRoute = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (credentials) => {
    const success = await login(credentials)

    if (success) {
      navigate('/')
    }
  }

  return <LoginForm doLogin={handleLogin} />
}

export default LoginRoute
