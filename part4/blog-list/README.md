# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

## Exercises 4.1.-4.2.

Note: this course material was written with version v22.3.0 of Node.js. Please make sure that your version of Node is at least as new as the version used in the material (you can check the version by running node -v in the command line).

In the exercises for this part, we will be building a blog list application, that allows users to save information about interesting blogs they have stumbled across on the internet. For each listed blog we will save the author, title, URL, and amount of upvotes from users of the application.

---

### Exercise 4.1 (Blog List Step 1)

* **Prerequisite:** Node.js version **≥ v22.3.0**.
  Verify your version by running:

```bash
node -v
```

* In this part, we will build a **blog list application**. Each blog stores:

  * `title` — title of the blog
  * `author` — author name
  * `url` — link to the blog
  * `likes` — number of upvotes

* Example application skeleton:

```js
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

* Steps:

  1. Turn this code into a functioning **npm project** (`npm init`, install dependencies).
  2. Configure the project to run with:

```bash
node --watch
```

3. Create a **MongoDB database**:

   * Either use **MongoDB Atlas**
   * Or use a local database (`mongodb://localhost/bloglist`)

4. Verify that the API works:

   * Use **Postman** or **VS Code REST Client**
   * Test `POST /api/blogs` to add blogs
   * Test `GET /api/blogs` to retrieve blogs

---

### Exercise 4.2 (Blog List Step 2)

* **Refactor the application** into separate modules:

  * Keep baby steps — verify that the application works after each change.
  * Avoid refactoring many things at once; otherwise Murphy's law applies.

* **Best practices:**

  * Commit your code every time it is in a stable state.
  * If `content.body` is undefined, make sure you have:

```js
app.use(express.json())
```
---

## Exercises 4.3–4.7 (Helper Functions and Unit Tests)

* Create a collection of **helper functions** for the blog list.
* Put them in `utils/list_helper.js`.
* Write tests in the `tests/` directory.

---

### Exercise 4.3 (Step 3 — Dummy Function)

* Define a **dummy function** that always returns `1`:

```js
const dummy = (blogs) => {
  return 1
}

module.exports = {
  dummy
}
```

* Verify test configuration:

```js
const { test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})
```

---

### Exercise 4.4 (Step 4 — Total Likes)

* Define a `totalLikes` function:

  * Receives an array of blogs
  * Returns the **total sum of likes**

```js
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}
```

* Example test:

```js
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})
```

---

### Exercise 4.5* (Step 5 — Favorite Blog)

* Define a `favoriteBlog` function:

  * Receives an array of blogs
  * Returns the blog with **the most likes**
  * If multiple blogs have the same highest likes, return any one

* Use `assert.deepStrictEqual` for object comparison in tests.

---

### Exercise 4.6* (Step 6 — Most Blogs)

* Define a `mostBlogs` function:

  * Receives an array of blogs
  * Returns the author with the **largest number of blogs**
  * Return format:

```js
{
  author: "Robert C. Martin",
  blogs: 3
}
```

* If multiple authors tie, return any one.

* Optional: use **Lodash** to simplify counting.

---

### Exercise 4.7* (Step 7 — Most Likes)

* Define a `mostLikes` function:

  * Receives an array of blogs
  * Returns the author whose blogs have the **largest total likes**
  * Return format:

```js
{
  author: "Edsger W. Dijkstra",
  likes: 17
}
```

* If multiple authors tie, return any one.

---

## Exercises 4.8–4.12

*Warning*: If you find yourself using `async/await` and `.then()` methods in the same code, it is almost guaranteed that you are doing something wrong. Use one or the other and **don't mix them**.

---

### 4.8: Blog List Tests, step 8

* **HTTP GET request test**:

  * Use the **SuperTest** library to write a test that makes an HTTP GET request to the `/api/blogs` URL.
  * Verify that the blog list application returns the correct number of blog posts in **JSON format**.

* **Refactor**:

  * Once the test is finished, refactor the route handler to use the **async/await** syntax instead of promises.

* **Notes**:

  * You will need to set up a **test environment** to use a separate database for tests.
  * When writing tests, it is better to **not execute them all at once** — only execute the ones you are working on.

---

### 4.9: Blog List Tests, step 9

* **ID property test**:

  * Write a test that verifies the unique identifier property of the blog posts is named `id`.
  * By default, MongoDB uses `_id`.

* **Implementation**:

  * Make the required changes to the code so that the test passes.
  * The `toJSON` method is an appropriate place to define the `id` property.

---

### 4.10: Blog List Tests, step 10

* **POST request test**:

  * Write a test that verifies that making an HTTP POST request to `/api/blogs` successfully creates a new blog post.
  * At minimum, verify that the total number of blogs **increases by one**.
  * You may also verify that the **content of the new blog post** is saved correctly in the database.

* **Refactor**:

  * Use **async/await** instead of promises once the test passes.

---

### 4.11*: Blog List Tests, step 11

* **Likes default value test**:

  * Write a test that verifies if the `likes` property is missing from the request, it will **default to 0**.
  * Do **not** test other properties of the blog yet.

* **Implementation**:

  * Make the required changes to the code to pass the test.

---

### 4.12*: Blog List Tests, step 12

* **Validation test for title and url**:

  * Write tests for creating new blogs via `/api/blogs`.
  * Verify that if **title** or **url** properties are missing from the request, the backend responds with **status code 400 (Bad Request)**.

* **Implementation**:

  * Make the required changes to the code so that the test passes.

---

## Exercises 4.13–4.14

### 4.13: Blog List Expansions, step 13

* **Deleting a blog post**:

  * Implement functionality for deleting a single blog post resource.
  * Use **async/await**.
  * Follow **RESTful conventions** for the HTTP API.
  * Implement **tests** to verify the functionality.

---

### 4.14: Blog List Expansions, step 14

* **Updating a blog post**:

  * Implement functionality for updating an individual blog post.
  * Use **async/await**.
  * Focus on updating the **number of likes**.
  * Implementation can follow the same approach as updating notes in part 3.
  * Implement **tests** to verify the functionality.

---

## User Administration (Part 4 – Blog List)

> **Note:** There were no explicit exercises for this topic in the course. The following steps were implemented to extend the application functionality.

### What was done:

* **User model created** (`models/user.js`) with:

  * `username`, `name`, `passwordHash`
  * Array of `blogs` referencing the blogs created by the user
  * `toJSON` transformation to hide password hashes and convert `_id` to `id`

* **User creation route** (`controllers/users.js`):

  * Implemented `POST /api/users` to create new users
  * Passwords hashed with `bcrypt`
  * Users can be created manually via script or API

* **Blog model updated** (`models/blog.js`) to include:

  * Reference to the `user` who created the blog (`user: ObjectId`)
  * Default value for `likes` if not provided

* **Seed scripts**:

  * `testUser.js` – creates a test user if it doesn’t exist
  * `testBlog.js` – creates a blog linked to a user
  * `seed.js` – optional combined script linking blogs and users

* **Integration in API**:

  * `POST /api/blogs` now expects a `userId` field to link the blog to a user
  * Blogs are saved and the corresponding user's `blogs` array is updated
  * Populated responses show the blog along with minimal user info (`username`, `name`)

### Notes / Limitations:

* No automated exercises or tests were provided in the course for User administration.
* Seed scripts bypass REST API logic (middleware, validation) – intended only to populate the database for testing purposes.
* Direct manipulation of MongoDB is “safe” for development but not recommended for production or formal tests.
* All user–blog relationships were implemented manually to simulate ownership and support testing of linked data.

---

## Exercises 4.15–4.23

In the next exercises, the basics of user management will be implemented for the Bloglist application. The safest way is to follow the course material from part 4 chapter **User administration** to the chapter **Token authentication**. Creativity is allowed, but do **not mix async/await with then calls**—use only one style consistently.

---

### 4.15: Blog List Expansion, step 3

* **Creating new users**:

  * Implement HTTP POST request to `api/users`.
  * Users have **username**, **password**, and **name**.
  * Do **not** save passwords as clear text; use **bcrypt** (or `bcryptjs` if bcrypt fails on Windows).
  * Implement a way to list all users via a suitable HTTP request.

---

### 4.16*: Blog List Expansion, step 4

* **User creation restrictions**:

  * Both username and password must be provided.
  * Minimum length: 3 characters.
  * Username must be **unique**.
  * Respond with appropriate status code and error message if invalid.
  * Validate password in the controller before Mongoose validation.
  * Implement tests ensuring invalid users are **not** created.

---

### 4.17: Blog List Expansion, step 5

* **Blogs and creators**:

  * Expand blogs to include information about the creator.
  * When adding a blog, assign a user from the database as its creator.
  * Modify listing of all blogs to embed creator info in JSON.
  * Modify listing of all users to embed their blogs.

---

### 4.18: Blog List Expansion, step 6

* **Token-based authentication**:

  * Implement authentication as per part 4 chapter **Token authentication**.

---

### 4.19: Blog List Expansion, step 7

* **Securing blog creation**:

  * Only allow adding blogs if a valid token is sent.
  * The user identified by the token becomes the creator.

---

### 4.20*: Blog List Expansion, step 8

* **Token middleware**:

  * Refactor token extraction into a middleware `tokenExtractor`.
  * Extract token from **Authorization** header.
  * Assign token to `request.token`.
  * Routes can access token via `request.token`.
  * Middleware structure:

  ```js
  const tokenExtractor = (request, response, next) => {
    // extract token
    next()
  }
  ```

---

### 4.21*: Blog List Expansion, step 9

* **Secure blog deletion**:

  * Only the creator of a blog can delete it.
  * Require token validation; respond with suitable status if invalid.
  * Convert `blog.user` object ID to string before comparison:

  ```js
  if (blog.user.toString() === userId.toString()) { ... }
  ```

---

### 4.22*: Blog List Expansion, step 10

* **User middleware**:

  * Create `userExtractor` middleware to attach user to `request.user`.
  * Register middleware per-route or for all `/api/blogs` routes.
  * Blog creation and deletion handlers access user directly:

  ```js
  blogsRouter.post('/', userExtractor, async (request, response) => {
    const user = request.user
    // ..
  })
  ```

  * Ensure fetching all blogs (GET) works without a token.

---

### 4.23*: Blog List Expansion, step 11

* **Fixing tests after authentication**:

  * Update tests broken by token-based authentication.
  * Add test to ensure blog creation fails with `401 Unauthorized` if no token is provided.
  * Push finished exercises to GitHub and mark them in the submission system.
