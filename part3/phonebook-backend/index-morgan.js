const express = require('express')
const morgan = require('morgan')

const app = express()

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

app.use(express.json())

morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return 'no-body'
})

const SHOW_BODY = true

if (SHOW_BODY) {
  const customFormat =
    ':method :url :status :res[content-length] - :response-time ms :body'

  app.use(morgan(customFormat))
} else {
  app.use(morgan('tiny'))
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  const newPerson = {
    id: String(persons.length + 1),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  res.status(201).json(newPerson)
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (Morgan)`)
})
