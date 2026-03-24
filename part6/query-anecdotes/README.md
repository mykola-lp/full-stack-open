# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

## Exercises 6.20.-6.22.

Now let's make a new version of the anecdote application that uses the React Query library. Take this project as your starting point. The project has a ready-installed JSON Server, the operation of which has been slightly modified (Review the server.js file for more details. Make sure you're connecting to the correct PORT). Start the server with npm run server.

Use the Fetch API to make requests.

NOTE: Part 6 was updated on 12th of October 2025 to use the Fetch API, which is introduced in part 6c. If you started working through this part before that date, you may still use Axios in the exercises if you prefer.

---

### Exercise 6.20 (Anecdotes React Query Step 1)

Implement retrieving anecdotes from the server using React Query.

The application should work in such a way that if there are problems communicating with the server, only an error page will be displayed:

browser saying anecdote service not available due to problems in server on localhost

You can find info here on how to detect possible errors.

You can simulate a problem with the server by turning off the JSON Server. Note that in a problem situation, the query is first in the state isLoading for a while, because React Query retries the request a few times before marking it as failed. You can optionally disable retries:

```js
const result = useQuery({
  queryKey: ['anecdotes'],
  queryFn: getAnecdotes,
  retry: false
})
````

or limit retries:

```js
const result = useQuery({
  queryKey: ['anecdotes'],
  queryFn: getAnecdotes,
  retry: 1
})
```

---

### Exercise 6.21 (Anecdotes React Query Step 2)

Implement adding new anecdotes to the server using React Query.

The application should render a new anecdote by default.

Note that the content of the anecdote must be at least 5 characters long, otherwise the server will reject the POST request.

You don't have to worry about error handling in this step.

---

### Exercise 6.22 (Anecdotes React Query Step 3)

Implement voting for anecdotes using React Query.

The application should automatically render the increased number of votes for the voted anecdote.

---

## Exercises 6.23.-6.24.

Now extend the anecdote application by adding a global notification system and improving error handling.

---

### Exercise 6.23

The application has a `Notification` component for displaying notifications to the user.

Implement the application's notification state management using the `useReducer` hook and Context API. The notification should inform the user when:

* a new anecdote is created
* an anecdote is voted on

The notification must be displayed for five seconds and then automatically cleared.

---

### Exercise 6.24

As stated in exercise 6.21, the server requires that the content of the anecdote to be added is at least 5 characters long.

Implement error handling for anecdote creation. In practice, it is sufficient to display a notification to the user when a POST request fails due to invalid input.

The error condition should be handled in the mutation callback function (e.g. `onError` in React Query). When a failure occurs, the user should see a notification indicating that the anecdote is too short.

This is the final exercise for this part of the course. After completing it, push your code to GitHub and mark all completed exercises in the submission system.