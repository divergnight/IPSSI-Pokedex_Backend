const WebSocket = require('ws')

enableWebSocket = server => {
	//initialize the WebSocket server instance
	const wss = new WebSocket.Server({ server })

	wss.on('connection', ws => {
		//connection is up, let's add a simple simple event
		ws.on('message', message => {
			//log the received message and send it back to the client
			console.log('received: %s', message)
			ws.send(JSON.stringify({ state: 'Send', message: `Hello  -> ${message}` }))
		})

		//send immediatly a feedback to the incoming connection
		ws.send(JSON.stringify({ state: 'Pending', message: 'Pending' }))
	})
}

module.exports = {
	enableWebSocket,
}
