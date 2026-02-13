# Information

For each web application for a series of exercises, it is recommended to submit all files relating to that application, except for the directory `node_modules`.

---

## Exercise 1.12 (step 1)

The world of software engineering is filled with anecdotes that distill timeless truths from our field into short one-liners.

Expand the following application by adding a button that can be clicked to display a random anecdote from the field of software engineering:

```js
import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)

  return (
    <div>
      {anecdotes[selected]}
    </div>
  )
}

export default App
```

Content of the file `main.jsx` is the same as in previous exercises.

Find out how to generate random numbers in JavaScript, e.g., via a search engine or on Mozilla Developer Network. Remember that you can test generating random numbers straight in the console of your browser.

Your finished application could look something like this: random anecdote with next button.

---

## Exercise 1.13 (step 2)

Expand your application so that you can vote for the displayed anecdote.

NB: store the votes of each anecdote into an array or object in the component's state. Remember that the correct way of updating state stored in complex data structures like objects and arrays is to make a copy of the state.

You can create a copy of an object like this:

```js
const votes = { 0: 1, 1: 3, 2: 4, 3: 2 }
const copy = { ...votes }
copy[2] += 1
```

Or a copy of an array like this:

```js
const votes = [1, 4, 6, 3]
const copy = [...votes]
copy[2] += 1
```

Using an array might be the simpler choice in this case. Searching the Internet will provide you with lots of hints on how to create a zero-filled array of the desired length.

---

## Exercise 1.14 (step 3)

Now implement the final version of the application that displays the anecdote with the largest number of votes:

If multiple anecdotes are tied for first place it is sufficient to just show one of them.

This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your finished exercises to the "my submissions" tab of the submission application.
