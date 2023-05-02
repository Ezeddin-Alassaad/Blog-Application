
Blog Application Backend API
This is the backend API for a blog application built using Node.js, Express, JWT, and Multer.

Table of Contents
Installation
Usage
API Endpoints
Authentication
Authorization
File Uploads
Installation
To install the required packages, run the following command in the project directory:


npm install
Usage
To start the server, run the following command:


npm start
The server will start on port 3000 by default. You can change the port by setting the PORT environment variable.

API Endpoints
The following API endpoints are available:

Endpoint	Method	Description
/api/posts	GET	Get a list of all blog posts.
/api/posts/:id	GET	Get a single blog post by ID.
/api/posts	POST	Create a new blog post.
/api/posts/:id	PUT	Update an existing blog post.
/api/posts/:id	DELETE	Delete a blog post.
/api/posts/:id/comments	GET	Get a list of all comments for a blog post.
/api/posts/:id/comments	POST	Add a new comment to a blog post.
/api/users	GET	Get a list of all users.
/api/users	POST	Create a new user.
/api/users/:id	GET	Get a single user by ID.
/api/users/:id	PUT	Update an existing user.
/api/users/:id	DELETE	Delete a user.
Authentication
Authentication is done using JSON Web Tokens (JWT). To authenticate a user, send a POST request to /api/auth with the user's email and password in the request body:

json
{
  "email": "user@example.com",
  "password": "password123"
}
If the email and password are correct, the server will respond with a JWT:

json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Include this token in the Authorization header of
