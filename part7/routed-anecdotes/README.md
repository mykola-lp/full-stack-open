# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

## Exercises 7.1–7.6

In this part we will extend the **routed anecdotes application** by creating **custom hooks** and improving state management.

Use the repository as a starting point:
[https://github.com/fullstack-hy2020/routed-anecdotes](https://github.com/fullstack-hy2020/routed-anecdotes)

If you clone it into an existing repository, remove its git history:

```bash
cd routed-anecdotes
rm -rf .git
```

Install dependencies and start the app:

```bash
npm install
npm run dev
```

To start the backend (JSON Server):

```bash
npm run server
```

---

### Exercise 7.1 (useField hook)

Create a custom hook `useField` in `src/hooks/index.js`.

The hook should:

* Manage the state of a single input field
* Return:

  * `type`
  * `value`
  * `onChange`

Use **named export**:

```js
export const useField = (type) => { ... }
```

Use the hook in the anecdote creation form.

---

### Exercise 7.2 (useField with reset)

Extend the `useField` hook:

* Add a `reset` function
* Add a button to clear all form fields

---

### Exercise 7.3 (Fixing the spread issue)

Fix the warning:

```
Invalid value for prop `reset` on <input> tag
```

Problem:

```js
<input {...content} />
```

This spreads `reset` into `<input>` which is invalid.

Solution:

* Keep spread syntax
* Exclude `reset` from props passed to `<input>`

---

### Exercise 7.4 (useAnecdotes, step 1)

Create a custom hook `useAnecdotes`.

The hook should:

* Fetch all anecdotes from the backend
* Use `useState` and `useEffect`

Backend endpoint:

```
http://localhost:3001/anecdotes
```

Usage:

```js
const { anecdotes } = useAnecdotes()
```

---

### Exercise 7.5 (useAnecdotes, step 2)

Extend the hook:

* Add `addAnecdote` function
* Send new anecdote to server
* Update local state

Usage:

```js
const { anecdotes, addAnecdote } = useAnecdotes()
```

Update `App` to pass `addAnecdote` to `CreateNew`.

---

### Exercise 7.6 (useAnecdotes, step 3)

Extend the hook:

* Add `deleteAnecdote` function
* Remove anecdote from server
* Update local state

UI:

* Add delete button for each anecdote

---

### Refactoring

Remove prop drilling:

* Do NOT pass:

  * anecdotes
  * addAnecdote
  * deleteAnecdote

Instead:

* Each component uses `useAnecdotes` directly

---

### Final App structure

```js
const App = () => {
  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Routes>
          <Route path="/" element={<AnecdoteList />} />
          <Route path="/create" element={<CreateNew />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}
```