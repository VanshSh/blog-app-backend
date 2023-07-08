const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, url, ...rest } = request.body
  if (!title || !url) {
    return response
      .status(400)
      .json({ error: 'Title and URL are required fields' })
  }
  const blog = new Blog({
    title,
    url,
    ...rest,
  })
  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogsRouter

// Explaining the code
// The blogsRouter is a router object which provides an interface similar to the app object.
// The router object is exported at the end of the file and imported by index.js.
