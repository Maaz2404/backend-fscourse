const express = require('express')
const app = express()
app.use(express.json())

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/api/persons/info', (request, response) => {
  console.log(request.headers['date']); 

  response.send(`
      Phonebook has info for ${persons.length} people\n
      ${new Date().toISOString()}
  `);
});



app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  person = persons.filter(note => note.id === id)
  if (person.length>0){
    console.log(person)
    response.json(person)
  }
  else{
    
    response.status(404).end()
  }

  
})
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(note => note.id !== id)
  console.log(persons)
  response.status(204).end()
  
})

const generateId = () => {
  const newID = persons.length > 0
    ? Math.floor(Math.random()*100)
    : 0
  return String(newID)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number){
    return response.status(400).json({
      error: 'content missing'
    })
  }
  if (persons.filter(p => p.name === body.name).length>0){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  console.log(persons)
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})