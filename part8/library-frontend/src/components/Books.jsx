import { useState } from 'react'
import { useQuery } from '@apollo/client/react'

import { ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null)

  const genresResult = useQuery(ALL_BOOKS, {
    skip: !show,
    variables: {
      genre: null,
    },
  })

  const booksResult = useQuery(ALL_BOOKS, {
    skip: !show,
    variables: {
      genre: selectedGenre,
    },
  })

  if (!show) return null
  if (genresResult.loading || booksResult.loading) return <div>loading...</div>
  if (!genresResult.data || !booksResult.data) return null

  const genres = [...new Set(genresResult.data.allBooks.flatMap((book) => book.genres))]
  const books = booksResult.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <div>
        in genre <strong>{selectedGenre || 'all genres'}</strong>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}

        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
