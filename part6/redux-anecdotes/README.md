# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

## Exercises 6.3.-6.8.

Let's make a new version of the anecdote voting application from part 1. Take the project from this repository [https://github.com/fullstack-hy2020/redux-anecdotes](https://github.com/fullstack-hy2020/redux-anecdotes) as the base of your solution.

If you clone the project into an existing git repository, remove the git configuration of the cloned application:

```bash
cd redux-anecdotes  // go to the cloned repository
rm -rf .git
```

The application can be started as usual, but you have to install the dependencies first:

```bash
npm install
npm run dev
```

After completing these exercises, your application should look like this:
browser showing anecdotes and vote buttons

---

### Exercise 6.3: Anecdotes, step 1

Implement the functionality for voting anecdotes. The number of votes must be saved to a Redux store.

### Exercise 6.4: Anecdotes, step 2

Implement the functionality for adding new anecdotes.

You can keep the form uncontrolled like we did earlier.

### Exercise 6.5: Anecdotes, step 3

Make sure that the anecdotes are ordered by the number of votes.

### Exercise 6.6: Anecdotes, step 4

If you haven't done so already, separate the creation of action-objects to action creator-functions and place them in the `src/reducers/anecdoteReducer.js` file, so do what we have been doing since the chapter action creators.

### Exercise 6.7: Anecdotes, step 5

Separate the creation of new anecdotes into a component called `AnecdoteForm`. Move all logic for creating a new anecdote into this new component.

### Exercise 6.8: Anecdotes, step 6

Separate the rendering of the anecdote list into a component called `AnecdoteList`. Move all logic related to voting for an anecdote to this new component.

Now the `App` component should look like this:

```js
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
```
---

## Exercise 6.9

### 6.9 Anecdotes, step 7

Implement filtering for the anecdotes that are displayed to the user.
browser showing filtering of anecdotes

Store the state of the filter in the Redux store. It is recommended to create a new reducer, action creators, and a combined reducer for the store using the `combineReducers` function.

Create a new `Filter` component for displaying the filter. You can use the following code as a template for the component:

```js
const Filter = () => {
  const handleChange = (event) => {
    // input-field value is in variable event.target.value
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter
```
---

## Exercises 6.10.-6.13.

Let's continue working on the anecdote application using Redux that we started in exercise 6.3.

---

### Exercise 6.10: Anecdotes, step 8

Install Redux Toolkit for the project. Move the Redux store creation into the file `store.js` and use Redux Toolkit's `configureStore` to create the store.

Change the definition of the filter reducer and action creators to use Redux Toolkit's `createSlice` function.

Also, start using Redux DevTools to debug the application's state easier.

---

### Exercise 6.11: Anecdotes, step 9

Change also the definition of the anecdote reducer and action creators to use Redux Toolkit's `createSlice` function.

---

### Exercise 6.12: Anecdotes, step 10

The application has a ready-made body for the `Notification` component:

```js id="x3u9wr"
const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return (
    <div style={style}>
      render here notification...
    </div>
  )
}

export default Notification
```

Extend the component so that it renders the message stored in the Redux store. Create a separate reducer for the new functionality by using Redux Toolkit's `createSlice` function.

The application does not have to use the Notification component intelligently at this point in the exercises. It is enough for the application to display the initial value set for the `notificationReducer`.

---

### Exercise 6.13: Anecdotes, step 11

Extend the application so that it uses the `Notification` component to display a message for five seconds when the user votes for an anecdote or creates a new anecdote:
browser showing message of having voted

It's recommended to create separate action creators for setting and removing notifications.

---

## Exercises 6.14.-6.15.

### Exercise 6.14: Anecdotes and the Backend, step 1

When the application launches, fetch the anecdotes from the backend implemented using json-server. Use the Fetch API to make the HTTP request.

As the initial backend data, you can use, e.g. this.

---

### Exercise 6.15: Anecdotes and the Backend, step 2

Modify the creation of new anecdotes, so that the anecdotes are stored in the backend. Utilize the Fetch API in your implementation once again.