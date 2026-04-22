import { useState } from 'react'
import { useMutation } from '@apollo/client/react'

import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      { query: ALL_BOOKS },
      { query: ALL_AUTHORS },
    ]
  })

  if (!show) return null

  const addGenre = (e) => {
    e.preventDefault()

    setGenres([...genres, genre])
    setGenre('')
  }

  const submit = (e) => {
    e.preventDefault()

    createBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres
      }
    })

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div>
          author
          <input value={author} onChange={e => setAuthor(e.target.value)} />
        </div>

        <div>
          published
          <input
            type="number"
            value={published}
            onChange={e => setPublished(e.target.value)}
          />
        </div>

        <div>
          genre
          <input
            value={genre}
            onChange={e => setGenre(e.target.value)}
          />

          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>

        <div>genres: {genres.join(' ')}</div>

        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook