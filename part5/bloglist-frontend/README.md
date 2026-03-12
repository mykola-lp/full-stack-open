# Information

For each web application for a series of exercises, submit all files relating to that application, except the node_modules directory.

---

## Exercises 5.1.-5.4.

In this part we will create a **frontend for the blog list backend** built in part 4.

You can use the application from GitHub as the base of your solution and connect it to your backend using a **proxy**, as shown in part 3.

It is enough to submit the **finished solution**. Committing after each exercise is optional.

These exercises revise everything learned about **React so far**. They may be challenging if your backend is incomplete, so it is recommended to use the backend solution from part 4 if necessary.

While doing the exercises, remember to use the **debugging methods** discussed earlier, especially checking the **browser console**.

> ⚠️ Warning  
> If you notice you are mixing `async/await` and `.then()`, you are almost certainly doing something wrong.  
> Use **either async/await OR then**, never both.

---

### Exercise 5.1 (Blog List Frontend Step 1)

Clone the application from GitHub:

```bash
git clone https://github.com/fullstack-hy2020/bloglist-frontend
```

Remove the git configuration from the cloned project:

```bash
cd bloglist-frontend
rm -rf .git
```

Install dependencies and start the application:

```bash
npm install
npm run dev
```

#### Task

Implement **login functionality** in the frontend.

* The token returned after successful login must be saved in the application's **state `user`**.

If a user **is not logged in**, only the login form should be visible.

If a user **is logged in**, the page should show:

* the **name of the logged-in user**
* the **list of blogs**

User details **do not need to be saved in localStorage yet**.

Example of conditional rendering:

```js
if (user === null) {
  return (
    <div>
      <h2>Log in to application</h2>
      <form>
        // ...
      </form>
    </div>
  )
}

return (
  <div>
    <h2>blogs</h2>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}
  </div>
)
```

---

### Exercise 5.2 (Blog List Frontend Step 2)

Make the login **persistent** by saving the user data in **localStorage**.

Also implement a **logout functionality**.

After logging out, ensure that the **browser no longer remembers the user details**.

---

### Exercise 5.3 (Blog List Frontend Step 3)

Extend the application so that a **logged-in user can add new blogs**.

Create a form that allows users to submit:

* blog title
* author
* URL

---

### Exercise 5.4 (Blog List Frontend Step 4)

Implement **notifications** that inform the user about successful and unsuccessful operations.

Examples:

* When a new blog is added → show a success notification.
* When login fails → show an error notification.

Notifications should appear **at the top of the page** and remain visible for **a few seconds**.

Adding colors to the notifications is **optional**.
