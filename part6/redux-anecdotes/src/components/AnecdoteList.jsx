import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const filtered = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  const sorted = [...filtered]
    .sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sorted.map(anecdote => (
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
    
          <div>
            has {anecdote.votes}
            <button
              onClick={() => {
                dispatch(voteAnecdote(anecdote.id))
                dispatch(setNotification(`you voted '${anecdote.content}'`))

                setTimeout(() => {
                  dispatch(clearNotification())
                }, 8000)
              }}
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList