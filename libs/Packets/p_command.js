module.exports = function(server, player, packet)
{
	let API = server.libraries.API
	server.libraries.logger(0, `${player.client.username} issued server command: ${packet.message}`)
	let end = packet.message.indexOf(' ')
	if(end == -1) end = packet.message.length
	if(server.commands[packet.message.substring(1, end)] != undefined)
	{
		server.commands[packet.message.substring(1, end)](player, packet)
	}
	else
	{
		API.message.send(player.client, server.messages.unknownCommand)
	}
}
