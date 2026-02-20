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
---

## Exercise 2.12 (Phonebook Step 7)

* Return to the phonebook application.
* Currently, added numbers are **not saved to the backend server**.
* Fix this so that new entries are stored on the server.
* Use `axios` to send an HTTP POST request to:

```
http://localhost:3001/persons
```

* Ensure the UI updates after the server responds.
* Update state using the response returned from the server.

---

## Exercise 2.13 (Phonebook Step 8)

* Extract all backend communication logic into a separate module.
* Create a service file (e.g., `services/persons.js`).
* Move HTTP logic (`get`, `post`, etc.) into that module.
* Export functions such as:

```js
getAll()
create(newObject)
```

* Import the service module into `App.jsx`.
* Keep components clean — no direct `axios` calls inside `App`.

---

## Exercise 2.14 (Phonebook Step 9)

* Implement deletion of entries.
* Add a dedicated **Delete** button for each person.
* Confirm deletion using:

```js
window.confirm('Delete this person?')
```

* Send an HTTP DELETE request to:

```
http://localhost:3001/persons/:id
```

Example:

```
http://localhost:3001/persons/2
```

* No data is sent with DELETE request.
* Use `axios.delete()` for the request.
* Update state after successful deletion.
* Do **not** use `delete` as a variable name (reserved word in JavaScript).

Incorrect example:

```js
// ❌ Not allowed
const delete = (id) => {}
```
---
## Exercise 2.15* (Phonebook Step 10)

* Why is there an asterisk? See the course explanation.
* Modify functionality so that:

  * If a person already exists,
  * Adding a new number replaces the old one.
* Use HTTP PUT method to update the resource.
* Send request to:

```
http://localhost:3001/persons/:id
```

* Ask user for confirmation before replacing number:

```js
window.confirm(`${name} is already in the phonebook. Replace the old number?`)
```

* Update state with the response returned from the server.
---
## Exercise 2.16 (Phonebook Step 11)

* Use the improved error message example from Part 2 as a guide.
* Show a notification after a **successful operation**:

  * When a person is added.
  * When a phone number is updated.
* The notification should:

  * Be visible for a few seconds.
  * Disappear automatically.
  * Be styled differently (e.g., green for success).
* Implement notification using component state.
* Example pattern:

```js
const [notificationMessage, setNotificationMessage] = useState(null)

const showNotification = (message) => {
  setNotificationMessage(message)
  setTimeout(() => {
    setNotificationMessage(null)
  }, 5000)
}
```

* Render a `<Notification />` component conditionally.
* Apply CSS styling for success messages (e.g., green text, border, background).

---
## Exercise 2.17* (Phonebook Step 12)

* Open the application in two different browsers.
* Delete a person in browser 1.
* Try to update the same person in browser 2.
* This will cause a:

```
404 Not Found
```

error from the backend.

* Handle the error using `.catch()` in the promise chain.
* Show a user-friendly error message on the screen.
* Remove the person from local state if the backend resource no longer exists.
* The message should:

  * Be visible for a few seconds.
  * Look different from success messages (e.g., red styling).
* Example logic:

```js
personsService
  .update(id, updatedPerson)
  .then(returnedPerson => {
    // success handling
  })
  .catch(error => {
    // show error notification
  })
```

* Even after handling the error:

  * The first `404` error will still appear in the browser console (this is normal).
  * You should NOT see:

```
Uncaught (in promise) Error
```
* Ensure both success and error notifications are clearly distinguishable via styling.
---
* Avoid defining components inside other components incorrectly.

* Ensure the component updates after the data is fetched and the state is set.
