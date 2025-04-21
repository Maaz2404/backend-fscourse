const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')

const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')

const Blog = require('../models/blog')
const api = supertest(app)


initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,

  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,

  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
}
)
test('returns correct amount of blogs', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  assert.strictEqual(blogs.length, initialBlogs.length)

})
test('returns blogs with id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  assert.strictEqual(blogs[0].id, initialBlogs[0]._id)
})

test('adds a new blog', async () => {
  const newBlog = {
    title: "New Blog",
    author: "New Author",
    url: "https://newblog.com",
    likes: 10,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await api.get('/api/blogs')
  const titles = blogsAtEnd.body.map(blog => blog.title)
  assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length + 1)
  assert(titles.includes('New Blog'))
})

test('adds a new blog without likes', async () => {
  const newBlog = {
    title: "New Blog",
    author: "New Author",
    url: "https://newblog.com",
  }
  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  const blogs = response.body
  const addedBlog = blogs.find(blog => blog.title === 'New Blog')
  assert.strictEqual(addedBlog.likes, 0)

})
test('returns 400 if title or url is missing', async () => {
  const newBlog = {
    title: "New Blog",
    author: "New Author",
    likes: 10,
  }
const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length)
  assert.strictEqual(response.body.error, 'title or url missing')
})

describe('deleting a blog', () => {
  test('deleteing a blog with correct id', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)
    const titles = blogsAtEnd.body.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })
  test('returns 404 if blog not found', async () => {
    const nonExistentId = '123456789012345678901234'
    const response = await api.delete(`/api/blogs/${nonExistentId}`)
      .expect(404)
    assert.strictEqual(response.body.error, 'blog not found')
  })
})
describe('updating a blog', () => {
  test('updating a blog with correct id', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    }
    await api.put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
    const blogsAtEnd = await api.get('/api/blogs')
    const updatedBlogFromDb = blogsAtEnd.body.find(blog => blog.id === blogToUpdate.id)
    assert.strictEqual(updatedBlogFromDb.likes, updatedBlog.likes)
  })
  test('returns 404 if blog not found', async () => {
    const nonExistentId = '123456789012345678901234'
    const updatedBlog = {
      ...initialBlogs[0],
      id: nonExistentId,
      likes: initialBlogs[0].likes + 1,}
      await api.put(`/api/blogs/${nonExistentId}`)
        .send(updatedBlog)
        .expect(404)
})
})

after(async () => {
  await mongoose.connection.close()
})

