const express=require('express')
const connectToDB = require('./config/connectToDB')
const errorHandler = require('./middlewares/error')

require('dotenv').config()
// Connect To DB
connectToDB()

// Init App
const app=express()

// Middlewares
app.use(express.json())

// Routes
app.use('/api/auth',require('./routes/authRoute'))
app.use('/api/users',require('./routes/usersRoute'))
app.use('/api/posts',require('./routes/postRoute'))
app.use('/api/comments',require('./routes/commentsRoute'))
app.use('/api/categories',require('./routes/categoriesRoute'))

app.use(notFound)

// Error Handler Midlware
app.use(errorHandler)
// Running The Server
const PORT=process.env.PORT

app.listen(PORT,()=>
console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))