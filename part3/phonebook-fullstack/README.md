# Information

For each web application for a series of exercises, submit all files relating to that application, except the `node_modules` directory.

---

# Exercises 3.9–3.11

The following exercises don't require many lines of code. They can however be challenging, because you must understand exactly what is happening and where, and the configurations must be just right.

## 3.9 Phonebook backend step 9

Make the backend work with the phonebook frontend from the exercises of the previous part. Do not implement the functionality for making changes to the phone numbers yet, that will be implemented in exercise 3.17.

You will probably have to do some small changes to the frontend, at least to the URLs for the backend. Remember to keep the developer console open in your browser. If some HTTP requests fail, you should check from the Network-tab what is going on. Keep an eye on the backend's console as well. If you did not do the previous exercise, it is worth it to print the request data or request.body to the console in the event handler responsible for POST requests.

## 3.10 Phonebook backend step 10

Deploy the backend to the internet, for example to Fly.io or Render. If you are using Fly.io the commands should be run in the root directory of the backend (that is, in the same directory where the backend package.json is).

**PRO TIP:** When you deploy your application to Internet, it is worth it to at least in the beginning keep an eye on the logs of the application AT ALL TIMES.

Test the deployed backend with a browser and Postman or VS Code REST client to ensure it works.

Create a README.md at the root of your repository, and add a link to your online application to it.

## 3.11 Full Stack Phonebook

Generate a production build of your frontend, and add it to the Internet application using the method introduced in this part.

Also, make sure that the frontend still works locally (in development mode when started with command `npm run dev`).

If you use Render, make sure the directory `dist` is not ignored by git on the backend.

**NOTE:** You shall NOT be deploying the frontend directly at any stage of this part. Only the backend repository is deployed throughout the whole part. The frontend production build is added to the backend repository, and the backend serves it as described in the section *Serving static files from the backend*.
