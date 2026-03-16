# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

## Exercises 5.17.-5.23.

In the last exercises of this part, let's do some **End-to-End (E2E) tests** for the blog application.

The material above should be enough to do most of the exercises. However, you should definitely read the **Playwright documentation and API description**, at least the sections mentioned at the end of the previous chapter.

---

### Exercise 5.17 (Blog List End To End Testing Step 1)

Create a **new npm project for tests** and configure **Playwright** there.

Make a test to ensure that the **application displays the login form by default**.

The body of the test should be as follows:

```js
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // ...
  })
})
```

---

### Exercise 5.18 (Blog List End To End Testing Step 2)

Create tests for **login functionality**.

Test both:

* **successful login**
* **failed login**

Create a **test user in the `beforeEach` block**.

The test structure expands as follows:

```js
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty the db here
    // create a user for the backend here
    // ...
  })

  test('Login form is shown', async ({ page }) => {
    // ...
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // ...
    })

    test('fails with wrong credentials', async ({ page }) => {
      // ...
    })
  })
})
```

The `beforeEach` block must **empty the database**, for example using the **reset method** used earlier in the course.

---

### Exercise 5.19 (Blog List End To End Testing Step 3)

Create a test that verifies that a **logged-in user can create a new blog**.

Example structure:

```js
describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    // ...
  })

  test('a new blog can be created', async ({ page }) => {
    // ...
  })
})
```

The test must ensure that the **created blog appears in the list of blogs**.

---

### Exercise 5.20 (Blog List End To End Testing Step 4)

Create a test that ensures that **a blog can be liked**.

---

### Exercise 5.21 (Blog List End To End Testing Step 5)

Create a test that ensures that **the user who created the blog can delete it**.

If you use `window.confirm` for the delete action, you may need to check **how to handle dialogs in Playwright tests**.

---

### Exercise 5.22 (Blog List End To End Testing Step 6)

Create a test that ensures that **only the user who created the blog can see the delete button**.

Other users should **not see the delete option**.

---

### Exercise 5.23 (Blog List End To End Testing Step 7)

Create a test that ensures that **blogs are ordered by the number of likes**, with the **most liked blog appearing first**.

This task is **significantly more challenging** than the previous ones.

---

This was the **last exercise of this section**.

Push your code to **GitHub** and mark the completed tasks in the **exercise submission system**.