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

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => response.json(persons))
})

app.get('/info', (request, response) => {
    Person.estimatedDocumentCount().then(totalPersons => {
        const date = new Date()
        response.send(
            `<p>Phonebook has info for ${totalPersons}</br> ${date} </p>`
        )
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
        .then(person => {
            if (person) 
                response.json(person)
            else    
                response.status(404).end()
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(result => response.json(result))
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const body = request.body
    const newInfoPerson = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(id, newInfoPerson, { new: true, runValidators: true, context: 'query' })
        .then(result => response.json(result))
        .catch(error => next(error))
})

errorHandler = (error, request, response, next) => {
    console.log(error)
    if (error.name === 'CastError')
        return response.status(400).send({ error: 'malformatted id' })
    else if (error.name === 'ValidationError')
        return response.status(400).send({error: error.message})
    next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))