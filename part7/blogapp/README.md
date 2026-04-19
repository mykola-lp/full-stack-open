# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

## Exercises 7.7.-7.10.

These exercises assume that you have already completed the exercises **5.24–5.28**. If you have not, do those first.

---

### Exercise 7.7 (Frontend and Backend in the Same Repository)

Restructure the **BlogList application** so that both **frontend and backend live in the same repository**.

#### Requirements:

* Place frontend and backend source code in a single repository
* Keep **separate `package.json` files** for frontend and backend
* Ensure development workflow works:

  * Running `npm run dev` inside the frontend starts **Vite dev server with hot reload**
* Ensure production build works:

  * Backend serves the built frontend as a static site
  * Use a command like:

```bash
npm run build && npm start
```

#### Notes:

* If dependency issues occur:

  * Delete all `node_modules`
  * Run `npm install` again in each directory

---

### Exercise 7.8 (Error Boundary)

Implement an **Error Boundary** in the React application.

#### Requirements:

* Add an error boundary component that:

  * Catches rendering errors in the component tree
  * Displays a **user-friendly fallback UI**
* The **navigation bar must remain outside** the error boundary
* If an error occurs, the rest of the app is replaced with an error message instead of a blank page

#### Testing:

You can simulate an error like this:

```js
const BlogList = ({ blogs }) => {
  throw new Error('simulated error')
  return (
    // ...
  )
}
```

---

### Exercise 7.9 (Nonexisting Routes)

Handle navigation to **non-existing routes**.

#### Requirements:

* If a user navigates to an unknown path:

  * Show a **"Page not found"** message instead of a blank page
* Use React Router:

```js
path="*"
```

---

### Exercise 7.10 (Automatic Code Formatting)

Integrate **Prettier** into the project.

#### Requirements:

* Configure Prettier for automatic code formatting
* Ensure formatting runs:

  * On save in the editor
* Prettier should enforce consistent code style across the project

---

## State Management: Zustand (Exercises 7.11–7.14)

You can implement state management using **Zustand** (or alternatively React Query + Context, or Redux if previously used in Part 6).

The goal is to progressively refactor a blog application state management into a centralized store.

---

### 7.11 (Zustand, Step 1)

Refactor the application to use Zustand for managing **notification state**.

Requirements:
- Move notification data into a Zustand store
- UI should consume notifications from the store
- Show success and error messages via centralized state

---

### 7.12 (Zustand, Step 2)

Store **blog posts** in Zustand.

Requirements:
- Blog list is stored in Zustand store
- Fetch blogs from backend and store them
- Ability to create a new blog
- Login and blog creation logic may remain in React component state (for now)

---

### 7.13 (Zustand, Step 3)

Extend functionality to support full blog interactions.

Requirements:
- Like a blog post
- Delete a blog post
- Update state accordingly after API operations

---

### 7.14 (Zustand, Step 4)

Store **authenticated user data** in Zustand.

Requirements:
- Store signed-in user in Zustand store
- Persist and restore user session (e.g. from localStorage)
- Ensure API requests use stored authentication token

---

### 7.15: Cleaning the code

Your application most likely contains code that handles the logged-in user via localStorage in several places:

```js
const userJSON = window.localStorage.getItem('loggedBlogappUser')

// ...

window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

// ...

window.localStorage.removeItem('loggedBlogappUser')
```

Extract this logic into a dedicated service module `src/services/persistentUser.js`, that exports the following functions:

```js
const getUser = () => { ... }
const saveUser = (user) => { ... }
const removeUser = () => { ... }
```

Replace all direct localStorage access in the application with calls to these functions.

Also take the `useField` hook introduced earlier in this part into use in the forms.

The rest of the tasks are common to both the Zustand and React Query versions.

---

### 7.16: Users view

Implement a view to the application that displays all of the basic information related to users.

---

### 7.17: Individual User View

Implement a view for individual users that displays all of the blog posts added by that user.

You can access this view by clicking the name of the user in the view that lists all users.

---

### 7.18: Comments, step 1

Implement the functionality for commenting the blog posts:

Comments should be anonymous, meaning that they are not associated with the user who left the comment.

In this exercise, it is enough for the frontend to only display the comments that the application receives from the backend.

An appropriate mechanism for adding comments to a blog post would be an HTTP POST request to the `api/blogs/:id/comments` endpoint.

---

### 7.19: Comments, step 2

Extend your application so that users can add comments to blog posts from the frontend.

---

### 7.20: Styling

Improve the visual appearance of the new features of your application using the techniques covered in part 5.

This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your completed exercises to the exercise submission system.