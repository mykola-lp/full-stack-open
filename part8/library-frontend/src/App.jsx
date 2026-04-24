import { useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client/react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import EditAuthor from './components/EditAuthor'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

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

const App = () => {
  const client = useApolloClient()
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [errorMessage, setErrorMessage] = useState(null)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data?.bookAdded

      if (!addedBook) {
        return
      }

      updateBooksCache(client.cache, ALL_BOOKS, { genre: null }, addedBook)

      addedBook.genres.forEach((genre) => {
        updateBooksCache(client.cache, ALL_BOOKS, { genre }, addedBook)
      })

      window.alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`)
    },
  })

  const logout = async () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    setPage('authors')
    await client.resetStore()
  }

  return (
    <div>
      {errorMessage ? <div>{errorMessage}</div> : null}

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {token ? (
          <>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('edit')}>edit author</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <Recommendations show={token && page === 'recommend'} />

      <NewBook show={token && page === 'add'} />

      <EditAuthor show={token && page === 'edit'} />

      <LoginForm
        show={!token && page === 'login'}
        setToken={setToken}
        setError={notify}
        setPage={setPage}
      />
    </div>
  )
}

export default App
