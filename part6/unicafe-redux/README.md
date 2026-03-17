# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

## Exercises 6.1.-6.2.

In these exercises, we implement a simplified version of the **unicafe application using Redux**.

The goal is to first implement the **state management logic (reducer + tests)** and then connect it to a simple UI.

---

### Exercise 6.1 (Unicafe Revisited Step 1)

Implement the **Redux reducer and its tests**.

The application state should have the following structure:

```js
{
  good: 0,
  ok: 0,
  bad: 0
}
```

You are given a base reducer:

```js
const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GOOD':
      return state
    case 'OK':
      return state
    case 'BAD':
      return state
    case 'RESET':
      return state
    default:
      return state
  }
}

export default counterReducer
```

And a base for tests:

```js
import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })
})
```

#### Requirements:

* The reducer must:

  * Return the initial state when called with `undefined`
  * Increment the correct field based on action type:

    * `GOOD` → increment `good`
    * `OK` → increment `ok`
    * `BAD` → increment `bad`
    * `RESET` → reset state to initial values
* The reducer must be **immutable** (no direct state mutation)
* Use `deep-freeze` in tests to ensure immutability

#### Additional tasks:

* Add tests for:

  * `OK` increment
  * `BAD` increment
  * `RESET` functionality

---

### Exercise 6.2 (Unicafe Revisited Step 2)

Implement the **UI for the application**.

The application should:

* Display buttons:

  * `good`
  * `ok`
  * `bad`
  * `reset stats`

* Display counts for each type:

  * number of `good`
  * number of `ok`
  * number of `bad`

#### Behavior:

* Clicking a button should dispatch the corresponding action:

  * `GOOD`
  * `OK`
  * `BAD`
  * `RESET`

* The UI should update based on the Redux store state