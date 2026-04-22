import { useQuery } from '@apollo/client/react'

import { ALL_BOOKS, ME } from '../queries'

const Recommendations = ({ show }) => {
  const meResult = useQuery(ME, {
    skip: !show,
  })

  const booksResult = useQuery(ALL_BOOKS, {
    skip: !show,
  })

  if (!show) return null
  if (meResult.loading || booksResult.loading) return <div>loading...</div>
  if (!meResult.data?.me || !booksResult.data) return null

  const favoriteGenre = meResult.data.me.favoriteGenre
  const recommendedBooks = booksResult.data.allBooks.filter((book) =>
    book.genres.includes(favoriteGenre)
  )

  return (
    <div>
      <h2>recommendations</h2>

      <div>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {recommendedBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
