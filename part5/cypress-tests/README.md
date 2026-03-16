# Information

For each web application for a series of exercises, submit all files relating to that application, except the node_modules directory.

---

## Exercises 5.17.-5.23.

In the last exercises of this part, we will do some **E2E tests for our blog application**.

The material of this part should be enough to complete the exercises. You must check out the **Cypress documentation**. It is probably the best documentation I have ever seen for an open-source project.

I especially recommend reading **Introduction to Cypress**, which states:

> This is the single most important guide for understanding how to test with Cypress. Read it. Understand it.

---

### Exercise 5.17 (Blog List End To End Testing Step 1)

Configure **Cypress** for your project.

Make a test that checks that the **application displays the login form by default**.

The structure of the test must be as follows:

```js
describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    // ...
  })
})
```

---

### Exercise 5.18 (Blog List End To End Testing Step 2)

Make tests for **logging in**.

Test both:

* **successful login**
* **unsuccessful login**

Create a **new user in the beforeEach block**.

The test structure extends like this:

```js
describe('Blog app', function() {
  beforeEach(function() {
    // empty the db here
    // create a user for the backend here
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    // ...
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      // ...
    })

    it('fails with wrong credentials', function() {
      // ...
    })
  })
})
```

The **beforeEach block must empty the database**, for example using the **reset method** used earlier in the course.

Optional bonus exercise:

Check that the **notification shown with unsuccessful login is displayed red**.

---

### Exercise 5.19 (Blog List End To End Testing Step 3)

Make a test that verifies that a **logged-in user can create a new blog**.

Example test structure:

```js
describe('Blog app', function() {
  // ...

  describe('When logged in', function() {
    beforeEach(function() {
      // ...
    })

    it('A blog can be created', function() {
      // ...
    })
  })

})
```

The test must ensure that **a new blog appears in the list of blogs**.

---

### Exercise 5.20 (Blog List End To End Testing Step 4)

Make a test that confirms that **users can like a blog**.

---

### Exercise 5.21 (Blog List End To End Testing Step 5)

Make a test ensuring that **the user who created a blog can delete it**.

---

### Exercise 5.22 (Blog List End To End Testing Step 6)

Make a test ensuring that **only the creator of the blog can see the delete button**, and **other users cannot**.

---

### Exercise 5.23 (Blog List End To End Testing Step 7)

Make a test that verifies that **blogs are ordered by likes**, with the **most liked blog appearing first**.

This exercise is more difficult than the previous ones.

One possible approach is to add a **specific class for the blog element** and use the `eq()` method:

```js
cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
```

Note that you might encounter problems if you **click the like button many times in a row**.

Cypress might click so fast that the **application state does not update between clicks**.

One way to solve this is to **wait until the like count updates before clicking again**.