require('dotenv').config()
const CORS_ORIGIN = process.env.CORS_ORIGIN

const { verifyClient } = require('./middlewares/auth.middleware')

const express = require('express')
const app = express()
const [server, port] = require('./config/server')(app)

const wsExpress = require('express-ws')(app, server, {
	wsOptions: {
		verifyClient: verifyClient,
	},
})

const cors = require('cors')

const error_handler = require('./middlewares/error_handler.middleware')
const routes = require('./routes')

// Start database connection
require('./database')

// Middleware
app.use(
	cors({
		origin: CORS_ORIGIN,
	})
)
app.use(express.json())
app.use('/static', express.static('./static'))

// Error handler middleware
app.use(error_handler)

// Endpoints
app.use('/', routes)

// Run server
server.listen(port, () => {
	console.log('Server running')
})
