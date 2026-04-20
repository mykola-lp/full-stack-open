import { useParams } from 'react-router-dom'
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'

import NotFound from '../shared/components/NotFound'
import { useUserById } from '../features/users/hooks/useUsersQuery'

const UserDetailRoute = () => {
  const { id } = useParams()
  const { isLoading, user } = useUserById(id)

  if (isLoading) {
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
