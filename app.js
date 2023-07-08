const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

// Explain the above code step by step from the top to the bottom.
// First the configuration is imported from utils/config.js.
// Then the Express server is imported from the express module.
// The app object is created with the express function.
// The app object is configured to use the json-parser of the express.json middleware,
// which parses all JSON-strings into JavaScript objects.
// The app object is configured to use the cors middleware.
// The app object is configured to use the requestLogger middleware.
// The app object is configured to use the unknownEndpoint middleware.
// The app object is configured to use the errorHandler middleware.
// The app object is exported as a module.
