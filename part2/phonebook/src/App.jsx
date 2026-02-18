import { useState, useEffect } from 'react'

import axios from 'axios'

import Header from './components/Header'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log('effect')

    axios
      .get('http://localhost:3001/persons')
      .then((response) => {
        console.log('promise fulfilled')
      
        setPersons(response.data)
    })
  }, [])
  console.log('render', persons.length, 'persons')

  const isDuplicate = (name) => {
    return persons.some(person => person.name.toLowerCase() === name.toLowerCase())
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const addPerson = (event) => {
    event.preventDefault()

    if (isDuplicate(newName)) {
      alert(`${newName} is already in the phonebook`)
      return
    }

    const newPerson = { name: newName, number: newNumber }

    setPersons(prevPersons =>
      prevPersons.concat(newPerson)
    )
  }

  return (
    <div>
      <Header level={2}>Phonebook</Header>

      <Filter
        filter={filter}
        onChange={(event) => setFilter(event.target.value)}
      />

      <Header level={3}>Add a new</Header>

      <PersonForm
        onSubmit={addPerson}
        name={newName}
        number={newNumber}
        onNameChange={(event) => setNewName(event.target.value)}
        onNumberChange={(event) => setNewNumber(event.target.value)}
      />

      <Header level={3}>Numbers</Header>
  
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App