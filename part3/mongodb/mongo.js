/*
  Command-line usage for mongo.js:

  node mongo.js <password> <name> <number>
    - <password>`: the password for your MongoDB user that has access to the database
    - <name>     : person's name (use quotes if it contains spaces)
    - <number>   : person's phone number

  Add a new person:
    node mongo.js myPassword Anna 040-1234556
    node mongo.js myPassword "Arto Vihavainen" 045-1232456
    node mongo.js myPassword "Ada Lovelace" 040-1231236

  List all persons (without adding):
    node mongo.js myPassword
*/

const mongoose = require('mongoose')

const password = process.argv[2]

if (!password) {
  console.log('give password as argument')
  process.exit(1)
}

const url = `mongodb+srv://mongodb:${password}@cluster0.jrygada.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })

    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
