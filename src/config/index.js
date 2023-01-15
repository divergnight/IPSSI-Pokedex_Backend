require('dotenv').config()

const { NODE_ENV, SSL_CERT, SSL_PRIVATE_KEY } = process.env

module.exports = {
	NODE_ENV,
	SSL_CERT,
	SSL_PRIVATE_KEY,
}
