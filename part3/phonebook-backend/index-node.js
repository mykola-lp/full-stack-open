const http = require('http')

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

const PORT = 3001

const server = http.createServer((request, response) => {

  if (
    request.method === 'GET'
    && request.url === '/api/persons'
  ) {
    response.writeHead(
      200, {
        'Content-Type': 'application/json'
    })
    response.end(JSON.stringify(persons))
  }

  if (
    request.method === 'GET'
    && request.url === '/info'
  ) {
    const date = new Date()
    
    response.writeHead(
      200, {
        'Content-Type': 'text/html'
    })
    response.end(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    `)
  }

  if (
    request.method === 'GET'
    && request.url.startsWith('/api/persons/')
  ) {
    const id = request.url.split('/')[3]
    const person = persons.find(p => p.id === id)

    if (person) {
      response.writeHead(
        200, {
          'Content-Type': 'application/json'
      })
      response.end(JSON.stringify(person))
    } else {
      response.writeHead(404)
      response.end()
    }
  }

  if (
    request.method === 'DELETE'
    && request.url.startsWith('/api/persons/')
  ) {
    const id = request.url.split('/')[3]
    persons = persons.filter(p => p.id !== id)

    response.writeHead(204)
    response.end()
  }

  if (
    request.method === 'POST' && request.url === '/api/persons'
  ) {
    let body = ''

    request.on('data', chunk => {
      body += chunk.toString()
    })

    request.on('end', () => {
      const data = JSON.parse(body)

      if (
        !data.name
        || !data.number
      ) {
        response.writeHead(
          400, {
            'Content-Type': 'application/json'
        })
        return response.end(JSON.stringify({
          error: 'name or number missing'
        }))
      }

      const nameExists = persons.some(p => p.name === data.name)

      if (nameExists) {
        response.writeHead(
          400, {
            'Content-Type': 'application/json'
        })
        return response.end(JSON.stringify({
          error: 'name must be unique'
        }))
      }

      const newPerson = {
        id: Math.floor(Math.random() * 1000000).toString(),
        name: data.name,
        number: data.number
      }

      persons.push(newPerson)

      response.writeHead(
        201, {
          'Content-Type': 'application/json'
        })
      response.end(JSON.stringify(newPerson))
    })
  }

  if (
    req.method === 'PUT'
    && req.url.startsWith('/api/persons/')
  ) {

    const id = req.url.split('/')[3]

    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      const parsedBody = JSON.parse(body)

      const index = persons.findIndex(p => p.id === id)

      if (index === -1) {
        res.statusCode = 404
        res.setHeader(
          'Content-Type', 'application/json'
        )
        res.end(JSON.stringify({
          error: 'person not found'
        }))

        return
      }

      persons[index] = {
        ...persons[index],
        number: parsedBody.number
      }

      res.setHeader(
        'Content-Type', 'application/json'
      )
      res.end(JSON.stringify(persons[index]))
    })
  }
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (Node)`)
})
