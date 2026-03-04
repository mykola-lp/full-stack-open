const mongoose = require('mongoose')

const phoneValidator = function(number) {
  return /^\d{2,3}-\d+$/.test(number)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [3, 'Name must be at least 3 characters long']
  },
  number: {
    type: String,
    required: [true, 'Phone number is required'],
    minLength: [8, 'Phone number must be at least 8 characters long'],
    validate: {
      validator: phoneValidator,
      message: props => `${props.value} is not a valid phone number`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
