const Pokedex = require('../models/pokedex.models')

const dtoPokedexAdd = async (req, res, next) => {
	try {
		const pokedex = req.body.pokedex

		// Check if pokedex is valid
		if (!(Array.isArray(pokedex) && pokedex.every(id => Number.isInteger(id) && id > 0))) {
			res.status(400).json({ message: 'The pokedex field must have an array of positive integers.' })
			return
		}

		return next()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const dtoPokedexRemove = async (req, res, next) => {
	try {
		const pokedex = req.body.pokedex

		// Check if pokedex is valid
		if (!(Array.isArray(pokedex) && pokedex.every(id => Number.isInteger(id) && id > 0))) {
			res.status(400).json({ message: 'The pokedex field must have an array of positive integers.' })
			return
		}

		return next()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

module.exports = {
	dtoPokedexAdd,
	dtoPokedexRemove,
}
