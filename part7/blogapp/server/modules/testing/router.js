const router = require('express').Router()

const { resetDatabase } = require('./service')

router.post('/reset', async (request, response) => {
  await resetDatabase()
  response.status(204).end()
})

module.exports = router
