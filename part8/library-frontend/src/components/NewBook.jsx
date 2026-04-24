import { useState } from 'react'
import { useMutation } from '@apollo/client/react'

import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const updateBooksCache = (cache, query, variables, addedBook) => {
  let existingData

  try {
    existingData = cache.readQuery({
      query,
      variables,
    })
  } catch {
    return
  }

  if (!existingData) {
    return
  }

  const alreadyIncluded = existingData.allBooks.some((book) => book.id === addedBook.id)

  if (alreadyIncluded) {
    return
  }

  cache.writeQuery({
    query,
    variables,
    data: {
      allBooks: existingData.allBooks.concat(addedBook),
    },
  })
}

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      { query: ALL_AUTHORS },
    ],
    update: (cache, response) => {
      const addedBook = response.data?.addBook

      if (!addedBook) {
        return
      }

      updateBooksCache(cache, ALL_BOOKS, { genre: null }, addedBook)

      addedBook.genres.forEach((genre) => {
        updateBooksCache(cache, ALL_BOOKS, { genre }, addedBook)
      })
    },
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
