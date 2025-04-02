require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const app = express()
app.use(express.json())
app.use(cors())
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

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body

  Person.findById(id).then(person => {
    if (!person) {
      return response.status(404).send({ error: 'person not found' })
    }

    person.name = name
    person.number = number

    return person.save().then(updatedPerson => {
      response.json(updatedPerson)
    })
  })
  .catch(error => {
    next(error) 
  })

})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})