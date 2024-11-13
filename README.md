# nebula-okra-api-task

## Overview
This project is a RESTful API for managing user data, built with TypeScript, Express, and MongoDB. It provides endpoints for creating, retrieving, updating, and deleting users, as well as for calculating user demographics and average age based on various filters.

## Running this API
1. Install necessary packages with `npm i`
2. Easily seed the database by running `npm run seed`
3. A test database has been provided in `.env.example`
4. You can copy all env variables in `.env.example` and use them to test using `cp .env.example .env` (for UNIX systems)
5. Start up the API with `npm start`

## Endpoints
- `GET /api/v1/users` - Get a list of users (accepts query parameters for specific users and pagination. Paginated by default to 10 per page)
- `GET /api/v1/users/:id` - Get a user by ID
- `POST /api/v1/users` - Create a new user
- `PUT /api/v1/users/:id` - Edit a user's details
- `DELETE /api/v1/users/:id` - Delete a user
- `GET /api/v1/users/average-age` - Get the average age of users by city or occupation (defaults to the average age of all users in the database)
- `GET /api/v1/users/demographics` - Retrieve user demographics including age distribution, city stats, and occupation stats

## Valid Query Parameters
### For `GET /api/v1/users`
- `page` (number): The page number to retrieve (default is 1).
- `limit` (number): The number of users to return per page (default is 10).
- `sortBy` (string): The field by which to sort the results (default is "createdAt").
- `order` (string): The order of sorting, either "asc" or "desc" (default is "desc").
- `search` (string): A search term to filter users by username.

### For `GET /api/v1/users/average-age`
- `occupation` (string): The occupation to filter users by.
- `city` (string): The city to filter users by.

### For `GET /api/v1/users/demographics`
- No query parameters are required.

## Valid Payloads
### For `POST /api/v1/users`
```json
{
"username": "John Doe",
"email": "john.doe@example.com",
"password": "securePassword123",
"dateOfBirth": "1990-01-01",
"city": "New York",
"occupation": "Software Engineer"
}
```


### For `PUT /api/v1/users/:id`
```json
{
"username": "John Doe Updated",
"email": "john.doe.updated@example.com",
"password": "newSecurePassword123",
"dateOfBirth": "1990-01-01",
"city": "Los Angeles",
"occupation": "Senior Software Engineer"
}
```


## Decisions
- **Single Route for Users**: A single route, `/api/v1/users`, is used to handle pagination and search. This simplifies the API structure and makes it easier to manage user-related operations.
- **Data Validation**: The API uses Joi for data validation to ensure that incoming requests meet the required schema. This helps prevent invalid data from being processed and improves overall data integrity.
- **Password Hashing**: User passwords are hashed using bcrypt before being stored in the database, enhancing security by protecting sensitive user information.
- **Pagination**: The API supports pagination for user retrieval, allowing clients to request a specific number of users per page, which is useful for large datasets.
- **Demographics Calculation**: The API includes endpoints to calculate user demographics, such as average age and distribution by city and occupation, providing valuable insights into the user base.
- **Error Handling**: Custom error handling middleware is implemented to provide meaningful error messages and status codes, improving the API's usability and debugging experience.

## Assumptions
- The API assumes that the MongoDB database is properly set up and accessible via the connection string provided in the environment variables.
- It is assumed that the client will handle the pagination and filtering logic on the frontend, making requests to the API as needed.
- The API is designed to be stateless, meaning that each request from the client must contain all the information needed to process that request.

## Optimizations
- **Asynchronous Operations**: All database operations are performed asynchronously to ensure that the API remains responsive and can handle multiple requests concurrently.
- **Indexing**: MongoDB indexes are used on frequently queried fields (e.g., username, email, city, occupation) to improve query performance.
- **Batch User Creation**: The API supports creating multiple users in a single request, which can reduce the number of database operations and improve performance when seeding data.

## Future Improvements
- Implement user authentication and authorization to secure endpoints.
- Add more comprehensive logging for monitoring and debugging purposes.
- Consider implementing rate limiting to prevent abuse of the API.
- Expand the API to include additional user-related features, such as user roles and permissions.
