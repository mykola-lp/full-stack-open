import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useNotification } from './context/NotificationContext'
import { setNotificationWithTimeout } from './context/NotificationHelper'

const App = () => {
  const queryClient = useQueryClient()
  const [, dispatch] = useNotification()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })

      setNotificationWithTimeout(
        dispatch,
        `you voted: "${updated.content}"`
      )
    },
  })

  const handleVote = (anecdote) => {
    voteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    })
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return (
      <div>
        anecdote service not available due to problems in server...
      </div>
    )
  }

  const anecdotes = result.data || []

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App