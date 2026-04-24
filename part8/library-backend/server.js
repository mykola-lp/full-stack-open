const http = require('http')

const cors = require('cors')
const express = require('express')
const { ApolloServer } = require('@apollo/server')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express5')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const jwt = require('jsonwebtoken')

const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const User = require('./models/user')

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }

  try {
    const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
    return User.findById(decodedToken.id)
  } catch (error) {
    return null
  }
}

const startServer = async (port) => {
  const app = express()
  const httpServer = http.createServer(app)
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const serverCleanup = useServer(
    {
      schema,
    },
    wsServer
  )

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
    })
  )

  app.use(
    '/',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization
        const currentUser = await getUserFromAuthHeader(auth)

        return { currentUser }
      },
    })
  )

  await new Promise((resolve) => {
    httpServer.listen({ port }, resolve)
  })

  console.log(`Server ready at http://localhost:${port}/`)
}

module.exports = startServer
