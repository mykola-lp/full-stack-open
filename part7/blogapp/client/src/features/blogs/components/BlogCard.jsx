import { useState } from 'react'

import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material'
import { useField } from '../../../shared/hooks/useField'

const Blog = ({ blog, addLike, addComment, currentUser, removeBlog }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const comment = useField('text')

  if (!blog) {
    return null
  }

  const comments = blog.comments ?? []

  const canBeRemoved = () =>
    currentUser && currentUser.username === blog.user.username

  const handleRemove = () => {
    removeBlog(blog)
    setConfirmOpen(false)
  }

  const handleAddComment = async (event) => {
    event.preventDefault()

    if (!comment.value.trim()) {
      return
    }

    const createdComment = await addComment(blog, comment.value)

    if (createdComment) {
      comment.reset()
    }
  }

  return (
    <Card sx={{ mt: 2, maxWidth: 600 }} className="blog">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>

        <Link
          href={blog.url}
          target="_blank"
          rel="noopener"
          display="block"
          sx={{ mb: 1 }}
        >
          {blog.url}
        </Link>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Added by {blog.user.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography variant="body1">{blog.likes} likes</Typography>
          {currentUser && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => addLike(blog)}
            >
              like
            </Button>
          )}
          {canBeRemoved() && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => setConfirmOpen(true)}
            >
              remove
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>

        <Box component="form" onSubmit={handleAddComment} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              label="Write a comment"
              type={comment.type}
              value={comment.value}
              onChange={comment.onChange}
              fullWidth
            />
            <Button type="submit" variant="contained">
              add comment
            </Button>
          </Stack>
        </Box>

        <List disablePadding>
          {comments.map((item, index) => (
            <ListItem key={item.id ?? `${item}-${index}`} disableGutters>
              <ListItemText primary={typeof item === 'string' ? item : item.comment} />
            </ListItem>
          ))}
        </List>
      </CardContent>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Remove blog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove blog <strong>{blog.title}</strong> by {blog.author}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>cancel</Button>
          <Button onClick={handleRemove} color="error" variant="contained">
            remove
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default Blog
