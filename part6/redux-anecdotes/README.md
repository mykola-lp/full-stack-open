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