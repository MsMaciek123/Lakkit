//TODO: make position and sender keywords arguments
function send(client, message, position = 0, sender = '0')
{
	client.write('chat', { message: convertToMessage(message), position: position, sender: sender })
}

function convertToMessage(msg) { return JSON.stringify({ translate: msg }); }

function broadcast(server, message, position = 0, sender = '0')
{
	for(id in server.clients)
	{ send(server.clients[id], message, position, sender) }
}

module.exports = { send, convertToMessage, broadcast } 
