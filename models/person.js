const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to ', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => console.log('Database connected'))
  .catch(err => {
    console.log(err)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: 3,
    requerided: true,
  },
  number: {
    type: String,
    minlength: 8
  }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)