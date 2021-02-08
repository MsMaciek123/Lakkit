const Plugin = require('./../libs/plugin')
const API = require('./../libs/api')
const minecraftProtocol = require('minecraft-protocol')
const Vec3 = require('vec3')
const fs = require('fs')

const pluginName = 'Lakkit'
var minecraftData = ''
var server = undefined

class PluginLakkit extends Plugin
{
	static onEnable(_server)
	{
		server = _server
		minecraftData = require('minecraft-data')(server.version)
		API.logger(0, `[${pluginName}] I\'m running!`)
	}
	
	static onDisable()
	{
		API.logger(0, `[${pluginName}] Disabling...`)
	}
	
	static afterJoin(player)
	{
		API.brandname.send(player, '\x06Lakkit')
		API.headerAndFooter.send(player, 'Serwer stoi na §6§lLakkicie!', 'Kontakt: MsMaciek#9399')
		player.setTitleTimes()
		player.sendTitle('Witaj')
		player.sendSubtitle('Na §6§lLakkicie')
		player.sendActionbar('Kontakt: MsMaciek#9399')
	}
	
	static onPlayerRotate(player, yaw, pitch, onGround)
	{
		//player.rotation = {yaw: yaw, pitch: pitch}
		//player.rotation.pitch = pitch
		/*player.rotation.yaw = `${yaw}`
		console.log(player.rotation.pitch)
		// resend info to all players
		for(let cl in server.entities.player)
		{
			if(server.entities.player[cl].client.uuid == player.client.uuid) continue
			server.entities.player[cl].client.write('entity_look',
			{
				entityId: player.entityId,
				yaw: yaw,
				pitch: 0,//player.rotation.pitch,//player.rotation.pitch,
				onGround: onGround
			})
		}*/
	}
	
	// load chunks
	static onPlayerMovement(player, x, y, z, onGround)
	{
		
	}
}
module.exports = PluginLakkit
