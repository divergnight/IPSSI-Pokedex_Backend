const User = require('../models/user.models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET, NODE_ENV } = require('.')

function genToken(id) {
	const expiresIn = NODE_ENV === 'production' ? '6 hours' : '72 hours'
	return jwt.sign(
		{
			id: id,
		},
		SECRET,
		{ expiresIn: expiresIn }
	)
}

const controllerUserLogin = async (req, res) => {
	try {
		const { login, password } = req.body

		const user = await User.findOne({ login: login })
		if (!user) {
			res.status(404).json({ message: 'User not found.' })
			return
		}

		bcrypt.compare(password, user.password, (err, result) => {
			if (result) {
				const token = genToken(user._id)

				res.status(200).json({
					username: login,
					token: token,
					piece: user.piece,
				})
			} else {
				res.status(401).json({
					message: 'Username or password is invalid.',
				})
			}
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const controllerUserRegister = async (req, res) => {
	try {
		const { login, password } = req.body

		const user = new User()
		bcrypt.hash(password, 10, async (err, hash) => {
			user.login = login
			user.password = hash
			user.picture = ''

			await user.save()
		})

		const token = genToken(user._id)

		res.status(201).json({
			username: login,
			token: token,
			piece: user.piece,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

module.exports = {
	controllerUserLogin,
	controllerUserRegister,
}
