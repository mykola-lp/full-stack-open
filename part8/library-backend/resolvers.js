const { GraphQLError } = require('graphql')
const crypto = require('crypto')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const SALT_LENGTH = 16
const KEY_LENGTH = 64
const SCRYPT_COST = 16384
const MIN_PASSWORD_LENGTH = 6
const BOOK_ADDED = 'BOOK_ADDED'
const pubsub = new PubSub()

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

const verifyPassword = async (password, passwordHash) => {
  if (!passwordHash) {
    return false
  }

  const [salt, storedKey] = passwordHash.split(':')

  if (!salt || !storedKey) {
    return false
  }

  const derivedKey = await scrypt(password, salt)
  const storedKeyBuffer = Buffer.from(storedKey, 'hex')

  if (storedKeyBuffer.length !== derivedKey.length) {
    return false
  }

  return crypto.timingSafeEqual(storedKeyBuffer, derivedKey)
}

const requireAuth = (currentUser) => {
  if (!currentUser) {
    throw new GraphQLError('not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    })
  }
}

const getAuthorBookCounts = async () => {
  const bookCounts = await Book.aggregate([
    {
      $group: {
        _id: '$author',
        bookCount: { $sum: 1 },
      },
    },
  ])

  return new Map(
    bookCounts.map((entry) => [String(entry._id), entry.bookCount])
  )
}

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      const filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })

        if (!author) {
          return []
        }

        filter.author = author._id
      }

      if (args.genre) {
        filter.genres = args.genre
      }

      return Book.find(filter).populate('author')
    },

    allAuthors: async () => {
      const [authors, bookCounts] = await Promise.all([
        Author.find({}),
        getAuthorBookCounts(),
      ])

      return authors.map((author) => ({
        ...author.toObject(),
        bookCount: bookCounts.get(String(author._id)) || 0,
      }))
    },

    me: (root, args, { currentUser }) => currentUser,
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(BOOK_ADDED),
    },
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      requireAuth(currentUser)

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })

        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError(`Saving author failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error,
            },
          })
        }
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }

      const populatedBook = await Book.findById(book._id).populate('author')

      await pubsub.publish(BOOK_ADDED, {
        bookAdded: populatedBook,
      })

      return populatedBook
    },

    editAuthor: async (root, args, { currentUser }) => {
      requireAuth(currentUser)

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError(`Saving author failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      return author
    },

    createUser: async (root, args) => {
      if (args.password.length < MIN_PASSWORD_LENGTH) {
        throw new GraphQLError(
          `Creating the user failed: password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.password,
            },
          }
        )
      }

      const passwordHash = await hashPassword(args.password)

      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
        passwordHash,
      })

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      }

      return user
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      const passwordCorrect = user
        ? await verifyPassword(args.password, user.passwordHash)
        : false

      if (!user || !passwordCorrect) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return {
        value: jwt.sign(userForToken, process.env.JWT_SECRET),
      }
    },
  },

  Author: {
    bookCount: (root) => {
      if (typeof root.bookCount === 'number') {
        return root.bookCount
      }

      return Book.countDocuments({ author: root._id })
    },
  },

  Book: {
    author: async (root) => {
      if (root.author?.name) {
        return root.author
      }

      return Author.findById(root.author)
    },
  },
}

module.exports = resolvers
