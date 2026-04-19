import { useNavigate } from 'react-router-dom'

import LoginForm from '../features/auth/components/LoginForm'
import { login } from '../features/auth/services/authService'

const LoginRoute = () => {
  const navigate = useNavigate()

  const handleLogin = async (credentials) => {
    const success = await login(credentials)

    if (success) {
      navigate('/')
    }
  }

  return <LoginForm doLogin={handleLogin} />
}

export default LoginRoute
