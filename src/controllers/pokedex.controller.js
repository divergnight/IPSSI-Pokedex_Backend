const PokeAPI = require('pokedex-promise-v2')
const Pokedex = require('../models/pokedex.models')

const pokedexToJson = pokedex => ({ count: pokedex.length, pokedex })

const controllerPokedexGet = async (req, res) => {
	try {
		const pokedex = await Pokedex.findOne({ user: req.user._id })

		res.status(200).json(pokedexToJson(pokedex?.uid || []))
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerPokedexUnlock = async (req, res) => {
	try {
		if (req.user.piece <= 0) return res.status(401).json({ message: 'Insufficient piece quantity.' })

		const allPokemons = (await new PokeAPI().getPokemonSpeciesList()).results
		const pokemonId = allPokemons[Math.floor(Math.random() * allPokemons.length) + 1].url.match(/\/([^/]+)\/?$/)[1]

		req.user.piece--
		await req.user.save()

		const pokedex = (await Pokedex.findOne({ user: req.user._id })) || new Pokedex({ user: req.user._id })
		pokedex.uid.push(pokemonId)
		await pokedex.save()

		res.status(200).json({ id: pokemonId })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerPokedexGetPiece = async (req, res) => {
	try {
		res.status(200).json({ piece: req.user.piece })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

module.exports = {
	controllerPokedexGet,
	controllerPokedexUnlock,
	controllerPokedexGetPiece,
	pokedexToJson,
}
