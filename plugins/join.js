const API = require('./../libs/api')
const Plugin = require('./../libs/plugin')
const minecraftProtocol = require('minecraft-protocol')
const pluginName = 'Join'
var minecraftData = ''
var server = undefined

class PluginJoin extends Plugin
{
	static onEnable(_server)
	{
		API.logger(0, `[${pluginName}] Plugin join.js zostal uruchomiony!`)
		server = _server
		minecraftData = require('minecraft-data')(server.version)
	}
	
	static onDisable()
	{
		API.logger(0, `[${pluginName}] Disabling...`)
	}
	
	static onJoin(player)
	{
		API.logger(0, `[${pluginName}] Plugin macka mowi, ze ktos dolaczyl z ip ${player.client.socket}`)
		for(let i = 0; i < server.entities.player.length; i++)
		API.message.send(server.entities.player[i], `${player.client.username} joined the game!`)
	}

}
module.exports = PluginJoin
