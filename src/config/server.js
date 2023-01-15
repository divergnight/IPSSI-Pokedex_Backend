const fs = require('fs')
const https = require('https')
const ws = require('../websocket')
const { NODE_ENV, SSL_CERT, SSL_PRIVATE_KEY } = require('.')

const configureServer = server => {
	const isProduction = NODE_ENV === 'production'

	if (isProduction) {
		try {
			// Get SSL certificats
			const privateKey = fs.readFileSync(SSL_PRIVATE_KEY)
			const certificate = fs.readFileSync(SSL_CERT)
			const credentials = { key: privateKey, cert: certificate }

			// Create HTTPS server
			server = https.createServer(credentials, server)

			// // Lauch Web socket
			// ws.enableWebSocket(server)
		} catch (error) {}
	}

	const port = isProduction ? 443 : 3000

	return [server, port]
}

module.exports = configureServer
