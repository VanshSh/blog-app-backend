const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

// const getTokenFrom = (request) => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

// To get all the blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  return response.json(blogs)
})

// To add the favrouite blog
blogsRouter.post('/', async (request, response) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodeToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const { title, url, ...rest } = request.body

  // Find the user based on their username
  const user = await User.findById(decodeToken.id)

  if (!user) {
    return response.status(400).json({ error: 'User not found.' })
  }

  if (!title || !url) {
    return response
      .status(400)
      .json({ error: 'Title and URL are required fields.' })
  }

  const blog = new Blog({
    title,
    url,
    author: user.name, // Set the author to the user's name
    user: user._id, // Associate the blog with the user's ObjectId
    ...rest,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  return response.status(201).json(savedBlog)
})

// To delete the blog
blogsRouter.delete('/:id', async (request, response) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodeToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const { id } = request.params
  const blog = await Blog.findById(id)
  if (blog.user.toString() !== decodeToken.id) {
    return response
      .status(403)
      .json({ error: 'Not authorized to delete this blog' })
  }
  await Blog.findByIdAndRemove(id)
  response.status(204).end()
})

// To update the blog
blogsRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { title, likes, ...rest } = req.body
  const blog = {
    title,
    likes,
    ...rest,
  }
  const update = await Blog.findByIdAndUpdate(id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  })
  res.json(update).status(200)
})
module.exports = blogsRouter

// Explaining the code
// The blogsRouter is a router object which provides an interface similar to the app object.
// The router object is exported at the end of the file and imported by index.js.
