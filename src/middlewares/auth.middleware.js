const jwt = require('jsonwebtoken')
const { SECRET } = require('.')
const User = require('../models/user.models')

const isAuthenticated = async (req, res, next) => {
	try {
		let token = req.headers.authorization

		// Check if token exist in headers
		if (!token) {
			res.status(401).json({ message: 'Token not provided.' })
			return
		}

		// Remove Bearer on the token
		const matches = token.match(/(bearer)\s+(\S+)/i)
		token = matches && matches[2]

		// Check is valid token
		return jwt.verify(token, SECRET, async (err, data) => {
			if (err) {
				res.status(401).json({ message: 'Bad token.' })
				return
			} else {
				// Check if is expired
				if (data.exp * 1000 < Date.now()) {
					res.status(401).json({ message: 'Token is expired.' })
					return
				}

				// Check if user exist
				const user = await User.findById({ _id: data.id })
				if (!user) {
					res.status(404).json({
						message: 'The associated user is not associated with the token does not exist.',
					})
					return
				}

				req.user = user
				return next()
			}
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'An error has occurred.' })
	}
}

const verifyClient = (info, cb) => {
	const protocols = info.req.headers['sec-websocket-protocol']?.split(', ') ?? []
	let token = !!protocols.length ? protocols[protocols.indexOf('access_token') + 1] : null

	if (!token) {
		cb(false, 401, 'Unauthorized')
	} else {
		if (token.startsWith('Bearer ')) {
			token = token.slice(7, token.length)
		}
		jwt.verify(token, process.env.SECRET, (err, decoded) => {
			if (err) {
				cb(false, 401, 'Unauthorized')
			} else {
				if (decoded.exp * 1000 < Date.now()) {
					cb(false, 401, 'Unauthorized')
				}

				info.req.user = decoded
				cb(true)
			}
		})
	}
}

module.exports = { isAuthenticated, verifyClient }
