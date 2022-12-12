const mongoose = require('mongoose')
const { connect, set } = mongoose

const URI = process.env.CREDS

mongoose.connection.on('connected', () => {
	console.log('Connection Established')
})

mongoose.connection.on('reconnected', () => {
	console.log('Connection Reestablished')
})

mongoose.connection.on('disconnected', () => {
	console.log('Connection Reestablished')
})

mongoose.connection.on('close', () => {
	console.log('Connection Closed')
})

mongoose.connection.on('error', error => {
	console.log('DB ERROR', error)
})

set('strictQuery', false)
set('debug', true)

connect(URI, { useUnifiedTopology: true, useNewUrlParser: true })
