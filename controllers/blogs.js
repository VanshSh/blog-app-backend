const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// To get all the blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

// To add the favrouite blog
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
  return response.status(201).json(result)
})

// To delete the blog
blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  await Blog.findByIdAndRemove(id)
  response.status(204).end()
})

// To update the blog
blogsRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { title, url, ...rest } = req.body
  const blog = {
    title,
    url,
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
