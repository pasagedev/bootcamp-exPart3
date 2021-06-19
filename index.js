require('dotenv').config()
const Person = require('./models/person')
const { request, json } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('post', function (req, res,) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))


// let persons = [
//     {
//         id: 1,
//         name: "Arto Hellas",
//         number: "040-123456"
//     },
//     {
//         id: 2,
//         name: "Ada Lovelace",
//         number: "39-44-5323523"
//     },
//     {
//         id: 3,
//         name: "Dan Abramov",
//         number: "12-43-234345"
//     },
//     {
//         id: 4,
//         name: "Marry Poppendick",
//         number: "39-23-6423122"
//     }
// ]

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => response.json(persons))
})

app.get('/info', (request, response) => {
    const numberPersons = persons.length
    const date = new Date()
    response.send(
        `<p>Phonebook has info for ${numberPersons}</br> ${date} </p>`,
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    person
        ? response.json(person)
        : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const personExist = person => {
    if (persons.find(p => p.name === person.name))
        return true
    else
        return false
}
app.post('/api/persons', (request, response) => {
    const body = request.body
    const newID = Math.floor(Math.random() * 1000 + 1)

    if (!body.name)
        return response.status(400).json({ error: 'name can not be empty' })
    if (!body.number)
        return response.status(400).json({ error: 'number can not be empty' })

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save()
        .then(savedPerson => response.json(savedPerson))
})



const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))