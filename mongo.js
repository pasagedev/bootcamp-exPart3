const mongoose = require('mongoose')
const arguments = process.argv

if (arguments.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password> || <person> && <number>')
    process.exit(1)
}

const password = arguments[2]
const url = `mongodb+srv://bootcamp:${password}@cluster0.lz7do.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('Database connected'))
    .catch(err => {
        console.log(err)
        process.exit(1)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Person = mongoose.model('Person', personSchema)

if (arguments.length > 3) {
    const personToAdd = new Person({
        name: arguments[3],
        number: arguments[4]
    })
    personToAdd.save()
        .then(result => {
            console.log(`added ${result.name} number ${result.number} to phonebook`)
            mongoose.connection.close()
        })
        .catch(err => console.log(err))
} else {
    Person.find({})
        .then(result => {
            console.log('phonebook: ')
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}

