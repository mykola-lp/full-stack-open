import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

import { getUsers } from '../features/users/services/usersService'

const UserRoute = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    getUsers().then(setUsers)
  }, [])

  return (
    <Paper sx={{ mt: 3, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Users
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell align="right">Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Typography
                    component={Link}
                    to={`/users/${user.id}`}
                    sx={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {user.name}
                  </Typography>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell align="right">{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default UserRoute
