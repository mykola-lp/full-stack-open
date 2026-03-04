# Phonebook Application

🔗 Live Demo: https://phonehub-io.onrender.com/

---

# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

# Exercises 3.19–3.21

## 3.19*: Phonebook database, step 7

* **Validation for names**:

  * Name in the database must be **at least 3 characters long**.
* **Frontend error handling**:

  * Display an error message if Mongoose validation fails.
  * Example of handling errors with a `catch` block:

```js
personService
  .create({ ... })
  .then(createdPerson => {
    // ...
  })
  .catch(error => {
    console.log(error.response.data.error)
  })
```

* **Notes**:

  * On update operations, Mongoose validators are off by default — check documentation to enable them.

---

## 3.20*: Phonebook database, step 8

* **Validation for phone numbers**:

  * Minimum length: 8 characters
  * Must consist of **two parts separated by `-`**:

    * First part: 2 or 3 digits
    * Second part: remaining digits
    * Examples of valid numbers: `09-1234556`, `040-22334455`
    * Examples of invalid numbers: `1234556`, `1-22334455`, `10-22-334455`
* **Implementation**:

  * Use a **custom validator** in the Mongoose schema for the second part.
* **Server behavior**:

  * Invalid POST request → respond with appropriate status code + error message

---

## 3.21: Deploying the database backend to production

* **Full stack deployment**:

  * Generate a new production build of the frontend
  * Copy it to the backend repository (`dist` folder)
  * Verify local working version: `http://localhost:3001/`
* **Remote deployment**:

  * Push latest version to Fly.io / Render
  * Verify the app works online
* **Important note**:

  * **Do NOT deploy frontend separately**
  * Backend serves the production build; frontend is never deployed directly

---

# Exercise 3.22: Lint configuration

* Add **ESLint** to the application
* Fix all **warnings and errors**
* Push the final code to GitHub
* Mark all finished exercises in the submission system
