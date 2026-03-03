# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

# Exercises 3.9–3.11

The following exercises don't require many lines of code. They can however be challenging, because you must understand exactly what is happening and where, and the configurations must be just right.

## 3.9 Phonebook backend step 9

Make the backend work with the phonebook frontend from the exercises of the previous part. Do not implement the functionality for making changes to the phone numbers yet, that will be implemented in exercise 3.17.

You will probably have to do some small changes to the frontend, at least to the URLs for the backend. Remember to keep the developer console open in your browser. If some HTTP requests fail, you should check from the Network-tab what is going on. Keep an eye on the backend's console as well. If you did not do the previous exercise, it is worth it to print the request data or `request.body` to the console in the event handler responsible for POST requests.

## 3.10 Phonebook backend step 10

Deploy the backend to the internet, for example to Fly.io or Render. If you are using Fly.io the commands should be run in the root directory of the backend (that is, in the same directory where the backend `package.json` is).

**PRO TIP:** When you deploy your application to the Internet, it is worth it to at least in the beginning keep an eye on the logs of the application **AT ALL TIMES**.

Test the deployed backend with a browser and Postman or VS Code REST client to ensure it works.

Create a `README.md` at the root of your repository, and add a link to your online application to it.

## 3.11 Full Stack Phonebook

Generate a production build of your frontend, and add it to the Internet application using the method introduced in this part.

Also, make sure that the frontend still works locally (in development mode when started with command `npm run dev`).

If you use Render, make sure the directory `dist` is not ignored by git on the backend.

**NOTE:** You shall NOT be deploying the frontend directly at any stage of this part. Only the backend repository is deployed throughout the whole part. The frontend production build is added to the backend repository, and the backend serves it as described in the section *Serving static files from the backend*.

---

# Exercises 3.12

## 3.12: Command-line database

Create a cloud-based MongoDB database for the phonebook application using **MongoDB Atlas**.

### **mongo.js**

Create a file `mongo.js` in the project directory. This file is used for:

* Adding entries to the phonebook
* Listing all existing entries in the phonebook

**NB:** Do **not** include your password in the file that you commit or push to GitHub.

### **Usage**

You run the program by passing command-line arguments. The first argument is the password:

```bash
node mongo.js yourpassword Anna 040-1234556
```

Expected output:

```text
added Anna number 040-1234556 to phonebook
```

If the name contains spaces, enclose it in quotes:

```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```

If only the password is given, the program lists all phonebook entries:

```bash
node mongo.js yourpassword
```

Example output:

```text
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
```

### **Technical notes**

* Use `process.argv` to read command-line arguments:

```text
process.argv[0] // path to node
process.argv[1] // path to mongo.js
process.argv[2] // password
process.argv[3] // name
process.argv[4] // number
```

* **Do not close the database connection too early**. For example, this is incorrect:

```js
Person
  .find({})
  .then(persons => {
    // ...
  })

mongoose.connection.close() // ❌ closes immediately, before .find finishes
```

* The correct approach is to close the connection **after the operation finishes**:

```js
Person
  .find({})
  .then(persons => {
    console.log(persons)
    mongoose.connection.close() // ✅ closes only after .find completes
  })
```

* If your model is named `Person`, Mongoose will automatically name the associated collection **`people`**.

---

# Exercises 3.13–3.14

The following exercises are straightforward, but if your frontend stops working with the backend, then finding and fixing bugs can be interesting.

## 3.13: Phonebook database, step 1

* Change the fetching of all phonebook entries so that the data is fetched from the **database** instead of a static array.
* Verify that the frontend still works after these changes.
* Write all Mongoose-specific code into its own module (e.g., `models/person.js`).

## 3.14: Phonebook database, step 2

* Change the backend so that **new numbers are saved to the database**.
* Verify that the frontend still works.
* At this stage, you can ignore whether the name already exists in the database.

---

# Exercises 3.15–3.18

## 3.15: Phonebook database, step 3

* Modify the backend so that **deleting phonebook entries is reflected in the database**.
* Verify that the frontend works after making the changes.

## 3.16: Phonebook database, step 4

* Move the **error handling** of the application to a **new error handler middleware**.

## 3.17*: Phonebook database, step 5

* If the user tries to create a new phonebook entry with a **name that already exists**, the frontend will attempt to update the phone number using a **PUT request** to the entry's unique URL.
* Modify the backend to **support this behavior**.
* Verify that the frontend works after your changes.

## 3.18*: Phonebook database, step 6

* Update the handling of the **HTTP GET `/api/persons/:id`** and **info routes** to use the database.
* Verify that they work directly with the browser, Postman, or VS Code REST client.
* Inspecting an individual phonebook entry from the browser should return a properly formatted JSON object.
