require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')

const Phonebook = require('./models/phonebook')

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
	return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status - :response-time ms :body'))

const generateId = () => {
	return Math.floor(Math.random() * 1000000)
}

app.get('/info', (req, res) => {
	res.send(
		`<p>phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
	)
})

app.get('/api/persons', (req, res) => {
	Phonebook.find({}).then((persons) => {
		res.json(persons)
	})
})

app.get('/api/persons/:id', (req, res) => {
	Phonebook.findById(req.params.id)
		.then((person) => {
			person
				? res.json(person)
				: res.status(404).send({ message: 'person not found' })
		})
		.catch((error) => {
			console.log(error)
			res.status(400).send({ message: 'malformatted id' })
		})
})

app.post('/api/persons', (req, res, next) => {
	const body = req.body
	if (!body.name || !body.number) {
		return res.status(400).send({ message: 'name or name missing' })
	}

	const person = new Phonebook({
		name: body.name,
		number: body.number,
		id: generateId(),
	})

	person
		.save()
		.then((savedPerson) => {
			res.json(savedPerson)
		})
		.catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Phonebook.findByIdAndUpdate(req.params.id, person, { new: true })
		.then((updatedContact) => {
			res.json(updatedContact)
		})
		.catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Phonebook.findByIdAndDelete(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ message: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return res.status(400).sen({ message: 'malformatted id' })
	}
	next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`server running on ${PORT}`))
