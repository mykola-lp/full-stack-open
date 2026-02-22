import { useState, useEffect } from 'react'

import Header from './components/Header'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Footer from './components/Footer'
import Notification from './components/Notification'

import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const removePersonFromState = (id) => {
    setPersons(persons.filter(p => p.id !== id))
  }

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        showNotification(`Failed to fetch persons: ${error.message}`, 'error')
      })
  }, [])

  const isDuplicate = (name) => {
    return persons.some(person => person.name.toLowerCase() === name.toLowerCase())
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const addPerson = (event) => {
    event.preventDefault()

    if (!isDuplicate(newName)) {
      const newPerson = { name: newName, number: newNumber }

      personsService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          showNotification(`Added ${returnedPerson.name}`)
        })
        .catch(error => {
          showNotification(`Failed to add ${newName}: ${error.message}`, 'error')
        })

      return
    }

    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (!window.confirm(`${newName} is already in the phonebook. Replace the old number with the new one?`)) {
      showNotification(`${newName} is already in the phonebook`)
      return
    }

    const updatedPerson = { ...existingPerson, number: newNumber }

    personsService.update(existingPerson.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(
          persons.map(p => p.id === existingPerson.id ? returnedPerson : p)
        )
        setNewName('')
        setNewNumber('')
        showNotification(`Updated ${returnedPerson.name}`)
      })
      .catch(error => {
        removePersonFromState(existingPerson.id)
        showNotification(`Information of '${existingPerson.name}' was already removed from server ${error.message}`, 'error')
      })
  }

  const deletePerson = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return

    personsService
      .remove(id)
      .then(() => {
        removePersonFromState(id)
        showNotification(`Deleted ${name}`)
      })
      .catch(error => {
        removePersonFromState(id)
        showNotification(`Information of '${name}' was already removed from server ${error.message}`, 'error')
      })
  }

  return (
    <div>
      <Header level={2}>Phonebook</Header>

      <Notification notification={notification} />

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
  
      <Persons persons={filteredPersons} handleDelete={deletePerson} />

      <Footer />
    </div>
  )
}

export default App
