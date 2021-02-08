const { performance } = require('perf_hooks');
const Plugin = require('./../libs/plugin')
const API = require('./../libs/api')

var server = undefined

class PluginTime extends Plugin
{
	static onEnable(_server)
	{
		server = _server
		server.commands['night'] = this.night
		server.commands['day'] = this.day
		server.commands['time'] = this.time
	}
	
	static night(player, packet)
	{
		API.time.set(server, 14000)
	}
	
	static day(player, packet)
	{
		API.time.set(server, 0)
	}

	static time(player, packet){
		const args = packet.message.split(" ")

		switch(args[1]){
			case 'set':
				switch(args[2]){
					case 'day':
						this.day(player,packet)
						break
					case 'night':
						this.night(player,packet)
						break
				}
			break
		}

		console.log(args)

	}

}

module.exports = PluginTime  
