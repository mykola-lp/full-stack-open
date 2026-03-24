import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotification } from '../context/NotificationContext'
import { setNotificationWithTimeout } from '../context/NotificationHelper'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [, dispatch] = useNotification()

  const createMutation = useMutation({
    mutationFn: createAnecdote,

    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })

      setNotificationWithTimeout(
        dispatch,
        `new anecdote: "${newAnecdote.content}"`
      )
    },

    onError: (error) => {
      setNotificationWithTimeout(
        dispatch,
        `error: ${error.message}`
      )
    },
  })

  const onCreate = (event) => {
    event.preventDefault()

    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    createMutation.mutate({
      content,
      votes: 0,
    })
  }

  return (
    <div>
      <h3>create new</h3>

      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm