const { model, Schema } = require('mongoose')

const userSchema = new Schema({
	login: String,
	password: String,
	piece: {
		type: Number,
		default: 4,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
})

module.exports = model('User', userSchema, 'users')
