import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdoteAsync } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const filtered = anecdotes.filter(anecdote =>
    String(anecdote.content)
      .toLowerCase()
      .includes(filter.toLowerCase())
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
                dispatch(voteAnecdoteAsync(anecdote))
                dispatch(setNotificationWithTimeout(`you voted '${anecdote.content}'`, 5))
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