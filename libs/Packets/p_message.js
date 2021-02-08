module.exports = function(server, player, packet)
{
	let API = server.libraries.API
	server.libraries.logger(0, `[Chat] ${player.client.username}: ${packet.message}`)
	for(let cl in server.entities.player)
	{
		API.message.send(server.entities.player[cl].client, `${player.client.username}: ${packet.message}`)
	}
}
