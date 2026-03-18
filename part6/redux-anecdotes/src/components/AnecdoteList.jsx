import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const sorted = [...anecdotes]
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
            <button onClick={() => dispatch(voteAnecdote(anecdote.id))}>
              vote
            </button>
          </div>  
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList