import { Link as RouterLink } from 'react-router-dom'

import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

const BlogList = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f3ede4' }}>
              <TableCell
                sx={{
                  width: '70%',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#2f4858',
                }}
              >
                article
              </TableCell>
              <TableCell
                sx={{
                  width: '30%',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#2f4858',
                }}
              >
                author
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBlogs.map(blog => (
              <TableRow
                key={blog.id}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/blogs/${blog.id}`}
                    underline="none"
                    color="inherit"
                    sx={{
                      display: 'inline-block',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: '#4a3f35',
                      transition: 'color 0.2s ease, transform 0.2s ease',
                      '&:hover': {
                        color: 'primary.main',
                        transform: 'translateX(2px)',
                      },
                    }}
                  >
                    {blog.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: '#4f6b5b',
                      fontWeight: 500,
                      fontStyle: 'italic',
                    }}
                  >
                    {blog.author}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList
