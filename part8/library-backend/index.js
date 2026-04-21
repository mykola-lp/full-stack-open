const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

// SCHEMA: defines WHAT you can ask from API
// - GraphQL type definitions = contract between client and server

// without ! - number or null,
// with ! - always number, never null (will trigger an error)

// genres: [String!]!
//
// String      → array element is a string
// String!     → element cannot be null
// [String!]   → array of strings (no null elements)
// [String!]!  → array itself cannot be null, and elements cannot be null
//
// Means:
// - always returns an array
// - contains only strings
// - null values are not allowed

const typeDefs = /* GraphQL */ `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }  
`
// RESOLVERS: define HOW to get the data for each field
// - functions that return actual values

// If a field is not present in the data → implement a separate resolver

// Query → top-level resolvers (entry points)
// Author → field-level resolvers (for Author type)

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,

    allBooks: (parent, args) => {
      let result = books

      if (args.author) {
        const authorExists = authors.some(a => a.name === args.author)

        if (!authorExists) {
          throw new GraphQLError('Author not found', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
            },
          })
        }

        result = result.filter(b => b.author === args.author)
      }

      if (args.genre) {
        result = result.filter(b => b.genres.includes(args.genre))
      }

      return result
    },

    allAuthors: () => authors,
  },

  // query: reads data
  // mutation: modifies data (create/update/delete)
  //
  // The id field is assigned a unique value using the uuid library.
  Mutation: {
    addBook: (parent, args) => {
      // basic validation
      if (!args.title || !args.author || !args.published) {
        throw new GraphQLError('Missing required fields', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
          },
        })
      }

      // optional: prevent duplicates (same title + author)
      const duplicate = books.find(
        b => b.title === args.title && b.author === args.author
      )

      if (duplicate) {
        throw new GraphQLError('Book already exists', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      // create book
      const book = {
        title: args.title,
        author: args.author,
        published: args.published,
        genres: args.genres || [],
        id: uuid(),
      }

      books.push(book)

      // ensure author exists
      const existingAuthor = authors.find(a => a.name === args.author)

      if (!existingAuthor) {
        authors.push({
          name: args.author,
          id: uuid(),
          born: null,
        })
      }

      return book
    },

    editAuthor: (parent, args) => {
      const author = authors.find(a => a.name === args.name)

      if (!author) {
        return null
      }

      // update field
      author.born = args.setBornTo
      return author
    },
  },

  Author: {
    bookCount: (parent) =>
      books.filter(b => b.author === parent.name).length,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})