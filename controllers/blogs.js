const blogsRouter = require('express').Router()
const { response } = require('../app')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if(!blog.title || !blog.url){
    return response.status(400).json({ error: 'title or url missing' })
  }
  if (!blog.likes){
    blog.likes = 0
  }

  const newBlog = await blog.save()
  response.status(201).json(newBlog)
})

blogsRouter.delete('/:id', async (request,response) => {
  const blogs = await Blog.findByIdAndDelete(request.params.id)
  if (blogs){
    response.status(204).json(response.body)
  }
  else {
    response.status(404).json({ error: 'blog not found' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,{ likes: blog.likes })
  if (updatedBlog) {
    response.json(updatedBlog.toJSON())
  } else {
    response.status(404).json({ error: 'blog not found' })
  }
})

module.exports = blogsRouter