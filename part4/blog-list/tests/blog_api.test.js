const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe('when the database contains pre-existing blogs', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have id property', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    expect(blog.id).toBeDefined()
  })
})

describe('fetching a specific blog by id', () => {

  test('a valid blog can be added', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })

    const token = loginResponse.body.token

    const newBlog = {
      title: 'test blog',
      author: 'tester',
      url: 'http://test.com',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    const blogs = await helper.blogsInDb()
    expect(blogs.map(b => b.title)).toContain('test blog')
  })

  test('if likes are missing it will default to 0', async () => {
    const newBlog = {
      title: 'No likes',
      author: 'Test',
      url: 'http://nolikes.com'
    }

    const token = await helper.loginAndGetToken('root', 'sekret')

    const response = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    expect(response.body.likes).toBe(0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'No title',
      url: 'http://test.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'No URL',
      author: 'Tester'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('adding blog fails without token', async () => {
    const newBlog = {
      title: 'token test',
      author: 'tester',
      url: 'http://test.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('deleting and updating blogs', () => {
  let blogsAtStart

  beforeEach(async () => {
    blogsAtStart = await helper.blogsInDb()
  })

  test('a blog can be deleted', async () => {
    const blogToDelete = blogsAtStart[0]

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const ids = blogsAtEnd.map(b => b.id)
    expect(ids).not.toContain(blogToDelete.id)
  })

  test('likes of a blog can be updated', async () => {
    const blogToUpdate = blogsAtStart[0]
    const newLikes = blogToUpdate.likes + 5

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: newLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(newLikes)
  })
})

describe('when there is initially some blogs', () => {
  let user

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    user = new User({ username: 'root', passwordHash })
    await user.save()

    const blog = new Blog({
      title: 'First blog',
      author: 'John',
      url: 'http://...',
      user: user._id
    })
    await blog.save()
  })

  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('a blog can be added', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'Test',
      url: 'http://new.com',
      likes: 5,
      userId: user._id
    }

    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    const blogsAtStart = await helper.blogsInDb()

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('New blog')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
