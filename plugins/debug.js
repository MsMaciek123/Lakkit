const API = require('./../libs/api')
const Plugin = require('./../libs/plugin')
const minecraftProtocol = require('minecraft-protocol')
const Vec3 = require('vec3')
const pluginName = 'Debug'
let minecraftData = undefined
var server = undefined
//let HYP = 1000;

class PluginDebug extends Plugin
{
	static onEnable(_server)
	{
		API.logger(0, `[${pluginName}] Plugin debug.js zostal uruchomiony!`)
		server = _server
		minecraftData = server.libraries['minecraft-data']
	}
	
	static onDisable()
	{
		API.logger(0, `[${pluginName}] Disabling...`)
	}

}
module.exports = PluginDebug
