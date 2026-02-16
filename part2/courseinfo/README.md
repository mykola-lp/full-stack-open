# Information

For each web application for a series of exercises, it is recommended to submit all files relating to that application, except for the directory `node_modules`.

---

## Exercise 2.1 (step 6)

Let's finish the code for rendering course contents from exercises 1.1–1.5.

You can start with the code from the model answers. The model answers for part 1 can be found in the submission system:

* Go to **My submissions**
* In the row corresponding to part 1, click **Show** under the solutions column
* Open `App.jsx` under `courseinfo`

If you copy a project from one place to another, you may need to delete the `node_modules` directory and reinstall dependencies using:

```bash
npm install
```

Generally, it is not recommended to copy a project's whole contents or add the `node_modules` directory to version control.

Change the `App` component like this:

```js
const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App
```

Define a component responsible for formatting a single course called `Course`.

Example component structure:

```
App
  Course
    Header
    Content
      Part
      Part
      ...
```

The `Course` component contains the components defined in the previous part, which render the course name and its parts.

You do **not** need the sum of exercises yet.

The application must work regardless of the number of parts a course has, so make sure it still works if parts are added or removed.

Ensure that the console shows no errors.

---

## Exercise 2.2 (step 7)

Show the **sum of the exercises** for the course.

---

## Exercise 2.3* (step 8)

If you haven't done so already, calculate the sum of exercises using the array method `reduce`.

Example:

```js
const total =
  parts.reduce((s, p) => someMagicHere)
```

If it does not work, use `console.log` and write the arrow function in long form:

```js
const total = parts.reduce((s, p) => {
  console.log('what is happening', s, p)
  return someMagicHere
})
```

If you are stuck, look up how `reduce` is used with arrays of objects.

---

## Exercise 2.4 (step 9)

Extend the application to support an arbitrary number of courses:

```js
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      // ...
    </div>
  )
}
```

The application should work with any number of courses.

---

## Exercise 2.5 (step 10)

Declare the `Course` component as a separate module and import it into the `App` component.

You may include all subcomponents of the course in the same module.
