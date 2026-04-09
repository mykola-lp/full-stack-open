import { useNavigate } from 'react-router-dom'

import { useAnecdotes, useField } from '../hooks'

const CreateNew = () => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const { addAnecdote } = useAnecdotes()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })

    handleReset(e)
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()

    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>

      <form onSubmit={handleSubmit}>
        <div>
          content
          <input
            name='content'
            type={content.type}
            value={content.value}
            onChange={content.onChange}
          />
        </div>

        <div>
          author
          <input
            name='author'
            type={author.type}
            value={author.value}
            onChange={author.onChange}
          />
        </div>

        <div>
          url for more info
          <input
            name='info'
            type={info.type}
            value={info.value}
            onChange={info.onChange}
          />
        </div>

        <button>create</button>
        <button type='button' onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
