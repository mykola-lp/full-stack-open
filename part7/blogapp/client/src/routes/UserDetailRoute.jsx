import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'

import NotFound from '../shared/components/NotFound'
import { getUserById } from '../features/users/services/usersService'

const UserDetailRoute = () => {
  const { id } = useParams()
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    getUserById(id).then(setUser)
  }, [id])

  if (user === undefined) {
    return null
  }

  if (user === null) {
    return <NotFound />
  }

  return (
    <Paper sx={{ mt: 3, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {user.name}
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Added blogs
      </Typography>
      <List>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id} disableGutters>
            <ListItemText primary={blog.title} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default UserDetailRoute
