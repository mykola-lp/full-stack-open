# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

## Exercises 3.1.-3.6.

**NB:** Since this is not about the frontend and React, the application is created with `npm init`, not Vite.

* **Do not add** the `node_modules` directory to version control.
* Create a `.gitignore` file in the root with:

```
node_modules
```

* Always keep an eye on the terminal while running backend code.

---

### 3.1: Phonebook backend step 1

* Implement a Node application that returns a hardcoded list of phonebook entries from:

```
http://localhost:3001/api/persons
```

* Data:

```json
[
  { "id": "1", "name": "Arto Hellas", "number": "040-123456" },
  { "id": "2", "name": "Ada Lovelace", "number": "39-44-5323523" },
  { "id": "3", "name": "Dan Abramov", "number": "12-43-234345" },
  { "id": "4", "name": "Mary Poppendieck", "number": "39-23-6423122" }
]
```

* Start server:

```
npm start
```

* Also provide a `npm run dev` command to restart the server automatically when source files change.

---

### 3.2: Phonebook backend step 2

* Implement a page at:

```
http://localhost:3001/info
```

* Page shows:

  * Current server time when request was received
  * Number of entries in the phonebook

---

### 3.3: Phonebook backend step 3

* Implement **GET by id**:

```
http://localhost:3001/api/persons/:id
```

* If entry not found, respond with proper HTTP status code (e.g., `404`).

---

### 3.4: Phonebook backend step 4

* Implement **DELETE by id**:

```
http://localhost:3001/api/persons/:id
```

* Test with Postman or VS Code REST Client.

---

### 3.5: Phonebook backend step 5

* Implement **POST** to add new phonebook entries:

```
http://localhost:3001/api/persons
```

* Generate `id` using `Math.random()` (use a sufficiently large range to avoid collisions).

---

### 3.6: Phonebook backend step 6

* Implement error handling for creating new entries:

  * Reject if **name or number is missing**
  * Reject if **name already exists**

* Respond with proper status code and explanatory JSON, e.g.:

```json
{ "error": "name must be unique" }
```

---

## Exercises 3.7.-3.8.

### 3.7: Phonebook backend step 7

* Add **Morgan middleware** for logging:

```js
const morgan = require('morgan')
app.use(morgan('tiny'))
```

* Logs show request method, URL, status, response time, etc. in terminal.

---

### 3.8*: Phonebook backend step 8

* Configure Morgan to **also log POST request bodies**:

  * Use `morgan.token()` to create a custom token
  * Use `JSON.stringify(req.body)` for POST data

Example:

```js
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

const customFormat = ':method :url :status :res[content-length] - :response-time ms :body'

app.use(morgan(customFormat))
```

* **Warning:** Logging bodies may expose sensitive data. In practice, avoid logging private information.
