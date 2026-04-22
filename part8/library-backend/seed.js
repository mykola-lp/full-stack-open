require('dotenv').config()

const crypto = require('crypto')
const mongoose = require('mongoose')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const SALT_LENGTH = 16
const KEY_LENGTH = 64
const SCRYPT_COST = 16384

const testUser = {
  username: 'testuser',
  favoriteGenre: 'refactoring',
  password: 'secret123',
}

const initialAuthors = [
  {
    name: 'Robert Martin',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky',
  },
  {
    name: 'Sandi Metz',
  },
]

const initialBooks = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime'],
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution'],
  },
]

const scrypt = (value, salt) =>
  new Promise((resolve, reject) => {
    crypto.scrypt(value, salt, KEY_LENGTH, { N: SCRYPT_COST }, (error, derivedKey) => {
      if (error) {
        reject(error)
        return
      }

      resolve(derivedKey)
    })
  })

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex')
  const derivedKey = await scrypt(password, salt)

  return `${salt}:${derivedKey.toString('hex')}`
}

const seedAuthors = async () => {
  const authorMap = new Map()

  for (const authorData of initialAuthors) {
    const author = await Author.findOneAndUpdate(
      { name: authorData.name },
      { $set: { born: authorData.born } },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    )

    authorMap.set(author.name, author)
  }

  return authorMap
}

const seedBooks = async (authorMap) => {
  for (const bookData of initialBooks) {
    const author = authorMap.get(bookData.author)

    if (!author) {
      throw new Error(`Author "${bookData.author}" not found while seeding books`)
    }

    await Book.findOneAndUpdate(
      { title: bookData.title },
      {
        $set: {
          published: bookData.published,
          genres: bookData.genres,
          author: author._id,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    )
  }
}

const seedTestUser = async () => {
  const passwordHash = await hashPassword(testUser.password)

  await User.findOneAndUpdate(
    { username: testUser.username },
    {
      $set: {
        favoriteGenre: testUser.favoriteGenre,
        passwordHash,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  )
}

const main = async () => {
  await mongoose.connect(process.env.MONGODB_URI)

  if (process.argv.includes('--reset')) {
    await Book.deleteMany({})
    await Author.deleteMany({})
    await User.deleteOne({ username: testUser.username })
    console.log('Cleared books, authors, and test user')
  }

  const authorMap = await seedAuthors()
  await seedBooks(authorMap)
  await seedTestUser()

  const [authorCount, bookCount, userCount] = await Promise.all([
    Author.countDocuments(),
    Book.countDocuments(),
    User.countDocuments(),
  ])

  console.log(
    `Seed complete: ${authorCount} authors, ${bookCount} books, ${userCount} users`
  )
  console.log(
    `Test login: username="${testUser.username}", password="${testUser.password}"`
  )
  await mongoose.connection.close()
}

main().catch(async (error) => {
  console.error('Seed failed:', error.message)

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close()
  }

  process.exit(1)
})
