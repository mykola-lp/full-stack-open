import { useState } from 'react'

export const useField = (type = 'text') => {
  const [value, setValue] = useState('')

  return {
    type,
    value,
    onChange: ({ target }) => setValue(target.value),
    reset: () => setValue(''),
  }
}
