
Blog Application Backend API
This is the backend API for a blog application built using Node.js, Express, MongoDB.

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
The server will start on port 5000 by default. You can change the port by setting the PORT environment variable.

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
Include this token in the Authorization header of subsequent requests to authenticate as that user:

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Authorization
Authorization is done using JSON Web Tokens (JWT) and middleware. 
To restrict access to certain endpoints to authenticated users, add the requireAuth middleware to the route handler:

javascript
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
For example, to restrict access to the /api/posts endpoint to authenticated users, add the requireAuth middleware to the route handler:

javascript
app.get('/api/posts', requireAuth, (req, res) => {
  // Handler function
});
File Uploads
File uploads are handled using the Multer middleware. To handle file uploads, add the multer middleware to the route handler:

javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/posts', upload.single('image'), (req, res) => {
  // Handler function
});
This will store the uploaded file in the uploads/ directory on the server. The req.file property will contain information about the uploaded file, such as its filename and MIME type:

javascript
console.log(req.file);
// {
//   fieldname: 'image',
//   originalname: 'example.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'uploads/',
//   filename: '2a9e1f188bc7d9e4f4e9f8e3a5f1f33d',
//   path: 'uploads/2a9e1f188bc7d9e4f4e9f8e3a5f1f33d',
//   size: 129065
// }
You can then save this information to your database or use it to generate a URL for the uploaded file.
