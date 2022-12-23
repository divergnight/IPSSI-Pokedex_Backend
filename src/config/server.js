const fs = require('fs')
const https = require('https')
const { NODE_ENV } = require('.')

const startServer = server => {
	const isProduction = NODE_ENV === 'production'

	if (isProduction) {
		try {
			// Get SSL certificats
			const privateKey = fs.readFileSync('sslcert/dev.vadn.key')
			const certificate = fs.readFileSync('sslcert/dev.vadn.crt')
			const credentials = { key: privateKey, cert: certificate }

			// Create HTTPS server
			server = https.createServer(credentials, server)
		} catch (error) {}
	}

	const port = isProduction ? 443 : 3000
	// Run server
	server.listen(port, () => {
		console.log('Server running')
	})
}

module.exports = startServer
