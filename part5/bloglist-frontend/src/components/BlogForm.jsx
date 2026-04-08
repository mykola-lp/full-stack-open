import { useState } from 'react'

import { TextField, Button, Stack } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <Stack spacing={2} sx={{ width: 500 }}>
        <TextField
          label="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />

        <TextField
          label="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />

        <TextField
          label="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </Stack>

      <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
        create
      </Button>
    </form>
  )
}

export default BlogForm