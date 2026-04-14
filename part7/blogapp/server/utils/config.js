require('dotenv').config()

const path = require('path')

const NODE_ENV = process.env.NODE_ENV || 'development'

const getRequiredEnvVar = (name) => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const getMongoUri = () => {
  if (NODE_ENV === 'test') {
    return getRequiredEnvVar('TEST_MONGODB_URI')
  }

  if (NODE_ENV === 'production') {
    return getRequiredEnvVar('MONGODB_URI')
  }

  return process.env.DEV_MONGODB_URI || getRequiredEnvVar('MONGODB_URI')
}

const MONGODB_URI = getMongoUri()
const PORT = process.env.PORT || 3001
const SECRET = getRequiredEnvVar('SECRET')
const CLIENT_DIST_PATH = path.join(__dirname, '../../client/dist')
const IS_PRODUCTION = NODE_ENV === 'production'
const IS_TEST = NODE_ENV === 'test'

module.exports = {
  CLIENT_DIST_PATH,
  IS_PRODUCTION,
  IS_TEST,
  MONGODB_URI,
  NODE_ENV,
  PORT,
  SECRET,
}
