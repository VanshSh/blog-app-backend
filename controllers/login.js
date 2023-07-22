const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const userFound = await User.findOne({ username })

  const passwordCorrect =
    userFound === null
      ? false
      : await bcrypt.compare(password, userFound.passwordHash)

  if (!(userFound && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: userFound.username,
    id: userFound.id,
  }

  try {
    const token = jwt.sign(userForToken, process.env.SECRET)
    res
      .status(200)
      .send({ token, username: userFound.username, name: userFound.name })
  } catch (error) {
    // Log the error to the console for debugging
    console.error('Error signing JWT:', error)
    // Handle the error and send an appropriate response
    res.status(500).send({ message: 'Internal Server Error' })
  }
})

module.exports = loginRouter
