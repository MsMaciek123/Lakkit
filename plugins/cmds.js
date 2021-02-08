const { performance } = require('perf_hooks');
const Plugin = require('./../libs/plugin')
const API = require('./../libs/api')

class PluginCmds extends Plugin
{
	static onEnable(server)
	{
		server.commands['ram'] = this.getRam
		server.commands['gc'] = this.runGC
		server.commands['gamemode'] = this.gamemode
		server.commands['eval'] = this.eva
	}
	
	static eva(player, packet)
	{
		if(packet.message.length > 6)
		{
			try {
			eval(packet.message.substring(6))
			} catch(e) { API.message.send(player.client, `${e}`) }
		}
		else API.message.send(player.client, '/eval <code>')
	}
	
	static gamemode(player, packet)
	{
		switch(packet.message.substring(10))
		{
			case '0':
			case '1':
			case '2':
			case '3':
				API.message.broadcast(`[${player.username}] Switched gamemode to ${packet.message.substring(10)}`)
				player.setGamemode(parseInt(packet.message.substring(10)))
				break;
			
			default:
				API.message.send(player.client, 'Unknown gamemode! (use numbers 0-3)')
				break;
		}
	}
	
	static getRam(player, packet)
	{
		let used = process.memoryUsage();
		function par(l) { return(Math.round(l/1024/1024*100)/100) }
		API.message.send(player.client, `RSS: ${par(used['rss'])} MB, Heap: ${par(used['heapUsed'])} MB / ${par(used['heapTotal'])} MB, arrayBuffers: ${par(used['arrayBuffers'])} MB`)
	}
	
	static runGC(player, packet)
	{
		if(packet.message.substring(4) == 'confirm')
		{
			API.message.send(player.client, `Starting GC`)
			try
			{
				if(global.gc)
				{
					let t1 = performance.now();
					global.gc();
					let t2 = performance.now();
					API.message.send(player.client, `GC done in ${Math.round(t2-t1)} miliseconds!`)
				}
				else API.message.send(player.client, 'GC is not supported (running without --expose-gc)')
			} catch (e) {
				API.message.send(player.client, 'Internal Error! (see console)')
				API.logger(2, `Internal error while performing GC: ${e}`)
			}
		}
		else
		{
			API.message.send(player.client, 'Are you sure? If yes, then type /gc confirm')
		}
	}
}

module.exports = PluginCmds 
