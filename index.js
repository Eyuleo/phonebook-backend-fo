const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
	return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status - :response-time ms :body'))

let persons = [
	{
		id: '1',
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: '2',
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: '3',
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: '4',
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
]

const generateId = () => {
	return Math.floor(Math.random() * 1000000)
}

app.get('/info', (req, res) => {
	res.send(
		`<p>phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
	)
})

app.get('/api/persons', (req, res) => {
	res.status(200).send(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = +req.params.id
	const person = persons.find((p) => Number(p.id) === id)

	person
		? res.status(200).send(person)
		: res.status(404).send({ error: 'not found' })
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	if (!body.name || !body.number) {
		return res.status(400).send({ message: 'name or name missing' })
	}

	const name = persons.find(
		(p) => p.name.toLowerCase() === body.name.toLowerCase()
	)
	if (name) {
		return res.status(400).send({ error: 'name must be unique' })
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	}

	persons = persons.concat(person)

	res.send(person)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = +req.params.id
	if (persons.find((p) => Number(p.id) === id)) {
		persons = persons.filter((p) => Number(p.id) !== id)
		return res.status(204).end()
	}
	res.status(400).send({ message: 'person not found' })
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ message: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const PORT = 3000
app.listen(PORT, () => console.log(`server running on ${PORT}`))
