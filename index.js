const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

// Explain the above code
// The app.js file is the starting point of the application.
// The file imports the Express application defined in app.js and
// starts the application on the port defined in the configuration file.
