const { request } = require('express')
const express = require('express')
const app = express()

let notes = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Marry Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(notes)
})

app.get('/info', (request, response) => {
    const numberPersons = notes.length
    const date = new Date()
    response.send(
        `<p>Phonebook has info for ${numberPersons}</br> ${date} </p>`,
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    note
    ? response.json(note)
    : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))