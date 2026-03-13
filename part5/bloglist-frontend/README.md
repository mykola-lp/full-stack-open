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

---

## Exercises 5.5.-5.12.

### Exercise 5.5 (Blog List Frontend Step 5)

Modify the form for creating blog posts so that it is **only displayed when appropriate**.  

* By default, the form is **not visible**  
  browser showing **new note button with no form**

* The form expands when the **"create new blog" button** is clicked  
  browser showing **form with create new**

* The form hides again after a **new blog is created** or the **cancel button** is pressed.

> Tip: You can use the **Togglable component** from part 5, or implement similar functionality.

---

### Exercise 5.6 (Blog List Frontend Step 6)

* Separate the form for creating a new blog into its **own component**, if not done already.  
* Move all **state variables required for creating a blog** into this component.  
* The component should work like the **NoteForm component** from part 5.

---

### Exercise 5.7 (Blog List Frontend Step 7)

* Add a **button to each blog** to control whether all blog details are shown.  

* Clicking the button should **toggle full details** of the blog.  
  browser showing **full details of a blog**; other blogs show only **view buttons**  

* At this point, the **like button does not need to work**.  

* Example of inline styles for a blog component:

```js
const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>      
      <div>
        {blog.title} {blog.author}
      </div>
      // ...
    </div>
  )
}
```

> Note: Even if the functionality is similar to the Togglable component, it cannot be used directly.  
> The easiest solution is to add a **state in the Blog component** to track if details are displayed.

---

### Exercise 5.8 (Blog List Frontend Step 8)

* Implement the **like button functionality**.  
* Likes should be increased by making an **HTTP PUT request** to the unique blog post URL.  
* Include **all fields of the blog** in the request body.

Example:

```json
PUT /api/blogs/5a43fde2cbd20b12a2c34e91
{
  "user": "5a43e6b6c37f3d065eaaa581",
  "likes": 1,
  "author": "Joel Spolsky",
  "title": "The Joel Test: 12 Steps to Better Code",
  "url": "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
}
```

> Make sure the backend handles the **user reference** as well.

---

### Exercise 5.9 (Blog List Frontend Step 9)

* If a blog is liked, check that the **name of the user who added the blog** is displayed.  
* If the name is missing on like, **fix the problem**.  
* If your code is correct and no problem occurs, you can skip this step.

---

### Exercise 5.10 (Blog List Frontend Step 10)

* Modify the application to **sort blogs by number of likes**.  
* Use **JavaScript array `sort` method** for sorting.

---

### Exercise 5.11 (Blog List Frontend Step 11)

* Add a **delete button** for blog posts.  
* Implement the **frontend logic for deleting blogs**.  

* Only show the delete button if the blog was **added by the logged-in user**.  
* Use `window.confirm` to show a **confirmation dialog** before deleting.  
  browser showing **confirmation of blog removal**

---

### Exercise 5.12 (Blog List Frontend Step 12)

* Add **ESLint** to the project.  
* Define your desired **configuration** in `eslint.config.js`.  
* Fix all **linting errors**.  

> Note: Vite installs ESLint by default; you only need to define your configuration and correct issues.

---

## Exercises 5.13.-5.16. (Blog List Tests)

### 5.13: Blog List Tests, step 1

* Test that **blog component** renders title and author.
* By default, URL and likes are **not shown**.
* Add CSS classes for testing if needed.

### 5.14: Blog List Tests, step 2

* Test that URL and likes are shown **after clicking toggle button**.

### 5.15: Blog List Tests, step 3

* Test that clicking the **like button twice** calls the event handler **twice**.

### 5.16: Blog List Tests, step 4

* Test **new blog form**.
* Ensure that submitting the form calls event handler with **correct details**.