import { FormControl, Input, Button, InputLabel } from '@mui/material'
import { useField } from '../../../shared/hooks/useField'

const Login = ({ doLogin }) => {
  const username = useField('text')
  const password = useField('password')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      await doLogin({ username: username.value, password: password.value })
      username.reset()
      password.reset()
    } catch (e) {
      console.log(e)
      console.log('wrong credentials')
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 8 }}>
          <FormControl>
            <InputLabel>username</InputLabel>
            <Input type={username.type} value={username.value} onChange={username.onChange} />
          </FormControl>
        </div>
        <div style={{ marginBottom: 8 }}>
          <FormControl>
            <InputLabel>password</InputLabel>
            <Input type={password.type} value={password.value} onChange={password.onChange} />
          </FormControl>
        </div>
        <div style={{ marginTop: 8 }}>
          <Button type="submit" variant="contained">
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Login
