const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms - :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (req, resp) => {
    const time = Date()
    resp.send(`
    <body>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${time.toLocaleString()}</p>
    </body>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(p => p.id === id)
    console.log(person)
    person ? response.json(person) : response.status(404).end()

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random()*100000)
}

app.post('/api/persons', (request, response) => {

    const body = request.body
    if (!body.name) {
        return response.status(400).json({"error": "Missing name"})
    }

    if (persons.map(x => x.name).includes(body.name)) {
        return response.status(400).json({"error": "Person has already been added"})
    }

    if (!body.number) {
        return response.status(400).json({"error": "Missing number"})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    console.log(person)

    persons = persons.concat(person)
    response.json(person)
})


const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})