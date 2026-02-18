# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

## Exercise 2.6 (Phonebook Step 1)

* Create a simple phonebook.
* Implement addition of names.
* Use `newName` state to control the input.
* Prevent default form submission.
* Example starting code uses:

```js
import { useState } from 'react'
```

* Use `debug: {newName}` for temporary debugging if needed.

---

## Exercise 2.7 (Phonebook Step 2)

* Prevent adding duplicate names.
* Use array methods to check existing entries.
* Alert user if duplicate:

```js
alert(`${newName} is already added to phonebook`)
```

---

## Exercise 2.8 (Phonebook Step 3)

* Allow adding phone numbers.
* Add second input for numbers.
* Update state to store both name and number.
* Ensure form updates state correctly.

---

## Exercise 2.9* (Phonebook Step 4)

* Implement a search field to filter people by name.
* Filtering should be case insensitive.
* Can use hardcoded dummy data to test:

```js
const [persons, setPersons] = useState([
  { name: 'Arto Hellas', number: '040-123456', id: 1 },
  { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
  { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
  { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
])
```
---

## Exercise 2.10 (Phonebook Step 5)

* Refactor by extracting components:

  * Filter/search field
  * Form for adding new people
  * Component to render all persons
  * Component to render single person details
* Keep state and event handlers in `App` root component.
* Example root structure after refactoring:

```js
const App = () => {
  // ... state and handlers

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter ... />

      <h3>Add a new</h3>

      <PersonForm ... />

      <h3>Numbers</h3>
      
      <Persons ... />
    </div>
  )
}
```
---

## Exercise 2.11 (Phonebook Step 6)

* Store the initial state of the phonebook in a `db.json` file at the root of the project:

```json
{
  "persons":[
    { "name": "Arto Hellas", "number": "040-123456", "id": "1" },
    { "name": "Ada Lovelace", "number": "39-44-5323523", "id": "2" },
    { "name": "Dan Abramov", "number": "12-43-234345", "id": "3" },
    { "name": "Mary Poppendieck", "number": "39-23-6423122", "id": "4" }
  ]
}
```

* Start `json-server` on port 3001 and verify that the server returns the list of people at:

```
http://localhost:3001/persons
```

* If port 3001 is already in use, close the other application or change the port. Example error:

```
Error: listen EADDRINUSE 0.0.0.0:3001
```

* Fetch the initial data from the server using the `axios` library.
* Use a `useEffect` hook to perform the fetching after the first render.

Example pattern:

```js
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
  }, [])

  return (
    <div>
      {/* ... render your phonebook */}
    </div>
  )
}
```
* Avoid defining components inside other components incorrectly.

* Ensure the component updates after the data is fetched and the state is set.
