import { Box, Button, Link, Paper, Stack, Typography } from '@mui/material'

const BlogDetails = ({ blog, handleLike, handleDelete, user }) => {
  if (!blog) {
    return (
      <Paper sx={{ mt: 3, p: 3, borderRadius: 3 }}>
        <Typography variant="h6">blog not found</Typography>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        p: 4,
        borderRadius: 3,
        backgroundColor: '#fcfaf6',
        border: '1px solid',
        borderColor: '#e7ddd0',
      }}
      className="blog-details-view"
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: '#2f4858',
              letterSpacing: '0.08em',
              fontWeight: 800,
            }}
          >
            blog entry
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: '#4a3f35',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {blog.title} {blog.author}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mb: 0.75,
              color: '#2f4858',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            source
          </Typography>
          <Link
            href={blog.url}
            underline="hover"
            sx={{
              color: '#4f6b5b',
              fontSize: '1rem',
              fontWeight: 600,
              wordBreak: 'break-all',
            }}
          >
            {blog.url}
          </Link>
        </Box>

        <Box
          className="blog-likes"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Typography sx={{ color: '#4a3f35', fontWeight: 600 }}>
            likes {blog.likes}
          </Typography>
          {user && (
            <Button
              onClick={() => handleLike(blog)}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#8b735f',
                '&:hover': {
                  backgroundColor: '#75604f',
                },
              }}
            >
              like
            </Button>
          )}
        </Box>

        <Typography sx={{ color: '#4f6b5b', fontStyle: 'italic', fontWeight: 500 }}>
          added by {blog.user?.name}
        </Typography>

        {blog.user?.username === user?.username && (
          <Box>
            <Button
              onClick={() => handleDelete(blog)}
              variant="outlined"
              color="error"
            >
              remove
            </Button>
          </Box>
        )}
      </Stack>
    </Paper>
  )
}

export default BlogDetails
