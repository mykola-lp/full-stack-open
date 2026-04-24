# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

##  Exercises 8.8–8.12

Through these exercises, we'll implement a frontend for the GraphQL library.

Take this project as a start for your application.

Note: if you want, you can also use React Router to implement the application's navigation.

---

###  8.8: Authors view

Implement an Authors view to show the details of all authors on a page.

---

### 8.9: Books view

Implement a Books view that shows the details of all books except their genres.

---

### 8.10: Adding a book

Implement a possibility to add new books to your application. The functionality can look like this.

Make sure that the Authors and Books views are kept up to date after a new book is added.

In case of problems when making queries or mutations, check from the developer console what the server response is.

The Apollo Client Devtools Chrome extension can be very helpful in diagnosing the situation.

---

### 8.11: Authors birth year

Implement a possibility to set authors birth year. You can create a new view for setting the birth year, or place it on the Authors view.

Make sure that the Authors view is kept up to date after setting a birth year.

---

### 8.12: Authors birth year advanced

Make the birth year form such that the birth year can be set via a dropdown only for an existing author.

You can use, for example, the select element or a separate library like react-select.

---

## Exercises 8.17–8.22

Through these exercises, we'll continue implementing and extending the frontend for the GraphQL library.

---

### 8.17: Listing books

After backend changes, the list of books no longer works.

Fix the issue so that books are fetched and displayed correctly again.

---

### 8.18: Log in

Adding new books and editing an author's birth year require authentication.

Implement login functionality and fix the related mutations.

Handling validation errors is not required at this stage.

You can design the login UI freely. One possible approach is to create a separate login view accessible via navigation.

When a user logs in, the navigation should update to display features available only to authenticated users.

---

### 8.19: Books by genre (Part 1)

Extend the application to allow filtering books by genre.

At this stage, the filtering can be implemented purely on the client side using React.

---

### 8.20: Books by genre (Part 2)

Implement a view that displays books based on the logged-in user’s favorite genre.

---

### 8.21: Books by genre with GraphQL

Refactor the genre filtering (from exercise 8.19) to be handled via a GraphQL query instead of client-side filtering.

If you already implemented it this way earlier, no further changes are needed.

---

### 8.22: Up-to-date cache and book recommendations

Ensure that the books view stays reasonably up to date when new books are added.

When using genre-based queries:

* the view should update at least when a genre is reselected
* automatic updates without interaction are not required

These exercises are more challenging and may benefit from completing later sections first.

---

## Exercises 8.23.-8.26

### 8.23: Subscriptions - server

Do a backend implementation for subscription `bookAdded`, which returns the details of all new books to its subscribers.

---

### 8.24: Subscriptions - client, part 1

Start using subscriptions in the client, and subscribe to `bookAdded`.

When new books are added, notify the user. Any method works. For example, you can use the `window.alert` function.

---

### 8.25: Subscriptions - client, part 2

Keep the application's book view updated when the server notifies about new books. You can ignore the author view.

You can test your implementation by opening the app in two browser tabs and adding a new book in one tab. Adding the new book should update the view in both tabs.

---

### 8.26: n+1

Solve the n+1 problem of the following query using any method you like.

```graphql
query {
  allAuthors {
    name
    bookCount
  }
}
```

---

## Submitting exercises and getting the credits

Exercises of this part are submitted via the submissions system just like in the previous parts, but unlike previous parts, the submission goes to a different course instance.

Remember that you have to finish at least 22 exercises to pass this part.

Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course.

Note that you need a registration to the corresponding course part for getting the credits registered.

You can download the certificate for completing this part by clicking one of the flag icons. The flag icon corresponds to the certificate's language.
