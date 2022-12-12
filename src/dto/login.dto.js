const User = require('../models/user.models')

const dtoField = (req, res, next) => {
	try {
		const { login, password } = req.body

		// Check if login is a string
		if (typeof login !== 'string') {
			res.status(400).json({ message: 'Username is missing or invalid.' })
			return
		}

		// Check if password is a string
		if (typeof password !== 'string') {
			res.status(400).json({ message: 'Password is missing or invalid.' })
			return
		}

		return next()
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const dtoRegister = async (req, res, next) => {
	dtoField(req, res, async () => {
		try {
			const { login, password } = req.body

			// Check that usernames have at least 3 characters
			if (login.length < 3) {
				res.status(400).json({
					message: 'The username must have a minimum length of 3.',
				})
				return
			}

			// Check if the password is sufficiently secure
			if (!password.match('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')) {
				res.status(400).json({
					message: 'The password must contain at least 8 characters, one number, one lowercase and one uppercase.',
				})
				return
			}

			// Check if username is already in use
			const user = await User.findOne({ login: login })
			if (user) {
				res.status(401).json({ message: 'This username is not available.' })
				return
			}

			req.user = user
			return next()
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'An error has occurred.' })
		}
	})
}

module.exports = {
	dtoRegister,
}
