const mongoose = require('mongoose')
const { connect, set } = mongoose

const { CREDS, NODE_ENV } = process.env

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
set('debug', NODE_ENV !== 'production')

connect(CREDS, { useUnifiedTopology: true, useNewUrlParser: true })
