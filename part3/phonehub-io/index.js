require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()
app.use(express.static('dist'))
app.use(express.json())

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

mongoose.connect(url, { family: 4 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err.message))

// GET all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(err => next(err))
})

// GET individual person by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).json({ error: 'person not found' })
    })
    .catch(err => next(err))
})

// GET info (count of persons + date)
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(err => next(err))
})

// POST new person or update number if name exists
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  Person.findOne({ name })
    .then(existingPerson => {
      if (existingPerson) {
        // Update existing person's number
        return Person.findByIdAndUpdate(
          existingPerson._id,
          { number },
          { new: true, runValidators: true, context: 'query' }
        ).then(updatedPerson => res.json(updatedPerson))
      } else {
        const person = new Person({ name, number })
        return person.save().then(savedPerson => res.status(201).json(savedPerson))
      }
    })
    .catch(err => next(err))
})

// DELETE person by ID
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) res.status(204).end()
      else res.status(404).json({ error: 'person not found' })
    })
    .catch(err => next(err))
})

// PUT update person's number
app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) res.json(updatedPerson)
      else res.status(404).json({ error: 'person not found' })
    })
    .catch(err => next(err))
})

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  res.status(500).json({ error: 'internal server error' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
