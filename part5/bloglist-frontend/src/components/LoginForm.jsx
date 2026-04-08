import { useState } from 'react'

import { TextField, Button } from '@mui/material'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = (event) => {
    event.preventDefault()

    handleLogin({
      username,
      password
    })

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <TextField
            label="username"
            variant="standard"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          <TextField
            label="password"
            variant="standard"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <Button type="submit" variant="contained" sx={{ marginTop: 1 }}>
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm