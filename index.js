require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')


const app = express()
app.use(express.json())
morgan.token('req-body', (request) => {
  return JSON.stringify(request.body); // Convert body to a string
});

// Apply Morgan with the custom token
app.use(morgan(':method :url :status :req-body'));
app.use(express.static('dist'))



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
  
})
app.get('/api/persons/info', (request, response) => {
   
  Person.find({}).then(people => {
    response.send(`
      Phonebook has info for ${people.length} people\n
      ${new Date().toISOString()}
  `);
  })
  
});



app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person){
      console.log(person)
      response.json(person)
    }
    else{
      
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({error:'malformatted id'})
  })
 

  
})
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    console.log("deleted")
    response.status(204).end()
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({error:'malformatted id'})
  })
  
  
})



app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    });
  }

  Person.findOne({ name: body.name })
    .then(person => {
      if (person) {
        return response.status(400).json({
          error: 'name must be unique'
        });
      }

      // Create and save only if name is unique
      const newPerson = new Person({
        name: body.name,
        number: body.number,
      });

      return newPerson.save();
    })
    .then(savedPerson => {
      if (savedPerson) {
        response.json(savedPerson);
      }
    })
    .catch(error => next(error)); // Handle errors properly
});


const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})