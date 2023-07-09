const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Go lang',
    author: 'Vansh Sharma',
    url: 'https://vanshsharma.hashnode.dev/unleashing-the-power-of-rtk-query-for-data-fetching-and-caching',
  },
  {
    title: 'Erlang',
    author: 'Vansh Sharma',
    url: 'https://vanshsharma.hashnode.dev/unleashing-the-power-of-rtk-query-for-data-fetching-and-caching',
    likes: 20,
  },
]
beforeEach(async () => {
  await Blog.deleteMany({})
  const noteObjects = initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = noteObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .expect((response) => {
      expect(response.body).toHaveLength(2)
    })
})

test('have unique identifier as id', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect((response) => {
      response.body.forEach((blog) => {
        expect(blog.id).toBeDefined()
      })
    })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Erlang',
    author: 'Vansh Sharma',
    url: 'https://vanshsharma.hashnode.dev/unleashing-the-power-of-rtk-query-for-data-fetching-and-caching',
    likes: 95,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length + 1)
})

test('if likes property is missing from request, it will default to 0', async () => {
  const newBlog = {
    title: 'HTML5',
    author: 'Vansh Sharma',
    url: 'https://vanshsharma.hashnode.dev/unleashing-the-power-of-rtk-query-for-data-fetching-and-caching',
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  expect(response.body[2].likes).toBe(0)
})

test('if title and url are missing from request, it will return 400 Bad Request', async () => {
  const newBlog = {
    author: 'Vansh Sharma',
    likes: 95,
  }
  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
  const blogsAtEnd = await api.get('/api/blogs')
  expect(blogsAtEnd.body).toHaveLength(initialBlogs.length - 1)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]
  const updatedBlog = {
    title: 'Go lang',
  }
  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200)
})

afterAll(async () => {
  await mongoose.connection.close()
})
