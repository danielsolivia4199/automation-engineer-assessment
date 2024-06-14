# Automation Engineer Assessment
## Description
### Scenario:
You are given an API that manages user data for a small application. The API has endpoints for creating a user, retrieving all users, retrieving a user by ID, updating a user, and deleting a user.

### Task:
Write integration tests for the following API endpoints using JavaScript and any testing framework of your choice (e.g., Jest, Mocha):

- POST /users - Create a new user
  - Test that a valid user is created successfully and returns a 201 status code.
  - Test input validation: sending invalid data should return a 400 status code.
  - Test handling of duplicate users (email needs to be unique).
- GET /users
    - Test that it returns all users with a 200 status code.
    - Test that it returns an empty array if no users are found.

- GET /users/{id} - Retrieve a user by ID
  - Test that it returns the correct user details with a 200 status code.
  - Test that it returns a 404 status code if the user is not found.

- PATCH /users/{id} - Update a user
  - Test updating user details successfully returns a 204 status code.
  - Test that the user details are updated correctly.
  - Test that it handles non-existing users by returning a 404 status code.
  - Test input validation (e.g., invalid email format should return a 400 status code).

- DELETE /users/{id} - Delete a user
  - Test successful deletion returns a 204 status code.
  - Test deletion of a non-existing user returns a 404 status code.

### Instructions:
- Write clear and concise tests, ensuring they are independent of each other.
- Use async/await for handling asynchronous operations.
- Include comments explaining the purpose of each test case.
- Provide setup and teardown methods for your test cases if needed.

### Submission Requirements:
- Fork this repository and commit your code to your fork.
- Add @mikeulvila as a collaborator to your forked repository.
- Ensure all tests pass successfully.
- Document any assumptions made during the testing process.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the tests

```bash
# unit tests
npm run test:cov

# e2e tests
npm run test:e2e
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
