import { useEffect, useState } from 'react'

import anecdoteService from '../services/anecdotes'

let anecdoteStore = []
let isInitialized = false

const listeners = new Set()

const updateStore = (nextAnecdotes) => {
  anecdoteStore = nextAnecdotes
  listeners.forEach(listener => listener(anecdoteStore))
}

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState(anecdoteStore)

  useEffect(() => {
    listeners.add(setAnecdotes)

    if (!isInitialized) {
      isInitialized = true
  
      anecdoteService.getAll().then(data => {
        updateStore(data)
      })
    }

    return () => {
      listeners.delete(setAnecdotes)
    }
  }, [])

  const addAnecdote = async (anecdote) => {
    const createdAnecdote = await anecdoteService.createNew(anecdote)
    updateStore(anecdoteStore.concat(createdAnecdote))
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.deleteOne(id)
    updateStore(anecdoteStore.filter(anecdote => anecdote.id !== id))
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}
