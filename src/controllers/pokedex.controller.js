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

const controllerPokedexAdd = async (req, res) => {
	try {
		const pokedex = (await Pokedex.findOne({ user: req.user._id })) || new Pokedex({ user: req.user._id })

		pokedex.uid = [...new Set(pokedex.uid.concat(req.body.pokedex))]

		await pokedex.save()

		res.status(200).json(pokedexToJson(pokedex?.uid))
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerPokedexRemove = async (req, res) => {
	try {
		const pokedex = (await Pokedex.findOne({ user: req.user._id })) || new Pokedex({ user: req.user._id })

		pokedex.uid = pokedex.uid.filter(id => !req.body.pokedex.includes(id))

		await pokedex.save()

		res.status(200).json(pokedexToJson(pokedex?.uid))
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerPokedexClear = async (req, res) => {
	try {
		await Pokedex.deleteOne({ user: req.user._id })

		res.status(204).json()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

module.exports = {
	controllerPokedexGet,
	controllerPokedexAdd,
	controllerPokedexRemove,
	controllerPokedexClear,
	pokedexToJson,
}
