import { TextField, Button, Stack } from '@mui/material'
import { useField } from '../../../shared/hooks/useField'

const BlogForm = ({ createBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const handleCreateNew = (event) => {
    event.preventDefault()
    createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    })
    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateNew}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField
            label="title"
            size="small"
            type={title.type}
            value={title.value}
            onChange={title.onChange}
          />
          <TextField
            label="author"
            size="small"
            type={author.type}
            value={author.value}
            onChange={author.onChange}
          />
          <TextField
            label="url"
            size="small"
            type={url.type}
            value={url.value}
            onChange={url.onChange}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ alignSelf: 'flex-start' }}
          >
            create
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default BlogForm
