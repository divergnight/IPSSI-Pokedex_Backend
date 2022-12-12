const { model, Schema } = require('mongoose')

const PokedexSchema = new Schema({
	uid: [Number],
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
})

module.exports = model('Pokedex', PokedexSchema, 'pokedex')
