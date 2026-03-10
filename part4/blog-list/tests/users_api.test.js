const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('../utils/test_helper')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'existing', name: 'Existing User', passwordHash })
  await user.save()
})

describe('User creation validation', () => {

  test('a valid user is created', async () => {

    const newUser = {
      username: 'newuser',
      name: 'Test User',
      password: 'password'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(201)

    const users = await helper.usersInDb()
    const usernames = users.map(u => u.username)

    expect(users).toHaveLength(2)
    expect(usernames).toContain('newuser')
  })

  test('fails if username is missing', async () => {
    const newUser = { name: 'NoUsername', password: 'password' }

    await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('fails if password is missing', async () => {
    const newUser = { username: 'nopassword', name: 'No Password' }

    await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('fails if username is shorter than 3 chars', async () => {
    const newUser = { username: 'ab', name: 'Short', password: 'password' }

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('username')
  })

  test('fails if password is shorter than 3 chars', async () => {
    const newUser = { username: 'validuser', name: 'ShortPass', password: 'pw' }

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('password')
  })

  test('fails if username is already taken', async () => {
    const newUser = { username: 'existing', name: 'Duplicate', password: 'password' }

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('unique')
  })

})

afterAll(() => {
  mongoose.connection.close()
})
