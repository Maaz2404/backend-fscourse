const { test, after,beforeEach, before } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const app = require('../app')
const supertest = require('supertest')

const api = supertest(app)
const mongoose = require('mongoose')
const Blog = require('../models/blog')

initialBlogs = [
  {
    id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,

  },
  {
    id: "5a422aa71b54a676234d17f8",
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
test('returns correct amount of blogs',async()=>{
    const response = await api.get('/api/blogs')
    const blogs = response.body
    assert.strictEqual(blogs.length, initialBlogs.length)
    
})


// describe('total likes', () => {
//     const listWithOneBlog = [
//       {
//         id: '5a422aa71b54a676234d17f8',
//         title: 'Go To Statement Considered Harmful',
//         author: 'Edsger W. Dijkstra',
//         url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//         likes: 5,
        
//       }
//     ]
//     const listWithManyBlogs = [
//         {
//             id: "5a422a851b54a676234d17f7",
//             title: "React patterns",
//             author: "Michael Chan",
//             url: "https://reactpatterns.com/",
//             likes: 7,
            
//           },
//           {
//             id: "5a422aa71b54a676234d17f8",
//             title: "Go To Statement Considered Harmful",
//             author: "Edsger W. Dijkstra",
//             url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//             likes: 5,
            
//           },
//     ]
    
//     test('of empty list is zero', () => {
//         const result = listHelper.totalLikes([])
//         assert.strictEqual(result, 0)
//     })
  
//     test('when list has only one blog, equals the likes of that', () => {
//       const result = listHelper.totalLikes(listWithOneBlog)
//       assert.strictEqual(result, 5)
//     })

//     test('of a bigger list is calculated right', () => {
//         const result = listHelper.totalLikes(listWithManyBlogs)
//         assert.strictEqual(result,12)
//     })
//   })
//   describe('favorite blog',() => {
//     const blog = [
//         {
//             id: "5a422a851b54a676234d17f7",
//             title: "React patterns",
//             author: "Michael Chan",
//             url: "https://reactpatterns.com/",
//             likes: 7,
            
//           },
//           {
//             id: "5a422aa71b54a676234d17f8",
//             title: "Go To Statement Considered Harmful",
//             author: "Edsger W. Dijkstra",
//             url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//             likes: 5,
            
//           },
//     ]

//     test('favorite blog is one with most likes',() => {
//         const result = listHelper.favouriteBlog(blog)
//         assert.deepStrictEqual(result,blog[0])    
//     })
//   })