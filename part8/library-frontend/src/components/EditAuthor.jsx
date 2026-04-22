import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { useMutation } from '@apollo/client/react'

import { EDIT_AUTHOR, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const EditAuthor = ({ show }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const { data } = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [
      { query: ALL_BOOKS },
      { query: ALL_AUTHORS },
    ]
  })

  if (!show) return null

  const submit = (e) => {
    e.preventDefault()

    editAuthor({
      variables: {
        name,
        setBornTo: Number(born)
      }
    })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        
        {/* SELECT AUTHOR */}
        <div>
          author
          <select
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            <option value="">select author</option>

            {data?.allAuthors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* BIRTH YEAR */}
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default EditAuthor