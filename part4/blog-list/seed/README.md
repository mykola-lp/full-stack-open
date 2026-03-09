## Why these scripts are not ideal for production or automated testing?

### Direct database manipulation without using the API

These scripts bypass the REST API (`/api/blogs`, `/api/users`), which means that the **business logic and middleware are not tested**.
For example, POST request validations implemented in the router are not executed.

### Hardcoded values

The scripts use fixed values such as:

* `username = 'testuser'`
* `passwordHash = 'hash_for_testing'`
* `blog title = 'Test blog'`

This makes the scripts **inflexible**. For proper testing, it is better to generate data dynamically using `beforeEach` or helper functions.

### No automated test verification

These scripts do not check whether the API endpoints (GET, POST, DELETE, PUT) actually work.
They act more like **seed/populate scripts** rather than real tests.

### Bypassing async/await in routers

While the scripts use `async/await` correctly themselves, they **bypass your routers entirely**, so middleware like authentication or error handling does not run.
