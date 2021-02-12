const cluster = require('cluster')
if(cluster.isMaster){
try { console.log(`System Info: NodeJS ${process.version} (term: ${process.env.TERM}) Host: ${process.platform} (${process.arch})`) } catch { console.log('Unknown system') }
console.log('Loading libraries, please wait...')
const logger = require('./libs/Utils/logger.js')
//try {

const { performance } = require('perf_hooks');
const version = '1.16.2'
const path = require('path')
const fs = require('fs')
const minecraftProtocol = require('minecraft-protocol')
const minecraftData = require('minecraft-data')(version)
const Chunk = require('prismarine-chunk')(version)
const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
const API = require('./libs/api')
const Vec3 = require('vec3')

class Server
{
	constructor(name='Server', IP=null, port=25565, onlinemode=true, encryption=true, motd='This is Lakkit!', viewDistance=8, maxPlayers=20, maxPlayersMessage='Sorry, but max players has got reached. Try again later!', unknownCommandMessage='Unknown command. Type "/help" for help.')
	{
		//TODO: Make this variables READ ONLY!
		this.name = name
		this.entities = {'player':[],'cow':[]}
		this.chunks = {}
		// testPlugin: require('./plugins/testPlugin')
		this.plugins = {}
		this.IP = IP
		this.port = port
		this.onlinemode = onlinemode
		this.motd = motd
		this.version = version
		this.viewDistance = viewDistance
		this.libraries = {
			'API': API,
			'minecraft-data': minecraftData,
			'prismarine-chunk': Chunk,
			'vec3': Vec3,
			'logger': logger
		}
		this.commands = {}
		this.time = 0
		this.maxPlayers = maxPlayers
		this.messages = {'maxPlayers': maxPlayersMessage, 'unknownCommand': unknownCommandMessage}
	}
	
	start()
	{
		let t1 = performance.now();
		const th = this
		this.server = minecraftProtocol.createServer({
			'online-mode': this.onlinemode,
			encryption: this.encryption,
			host: this.IP,
			port: this.port,
			version: version,
			motd: this.motd,
			maxPlayers: this.maxPlayers
		})
		
		// Parse NodeJS arguments
		process.execArgv.forEach(arg =>
		{
			if(arg.startsWith('--max-old-space-size='))
			{
				let memory = arg.substring(21)
				if(parseInt(memory) < 1024) logger(1, 'To start the server with more ram, launch it as "node --max-old-space-size=1024 server.js"')
			}
			else if(arg == '--expose-gc')
			{
				logger(1, 'Server is running with exposed GC. Make sure you know what are you doing!')
			}
		})
		
		
		// Some info stuff
		logger(0, `Starting minecraft server version ${server.version}`)
		logger(0, `This server is running Lakkit (MC: ${server.version}) (without API)`)
		let ip = server.IP ? null : '*'
		logger(0, `Server running at ${ip}:${server.port}`)
		
		if(!this.onlinemode)
		{
			logger(1, `**** SERVER IS RUNNING IN OFFLINE/INSECURE MODE!`)
			logger(1, `The server will make no attempt to authenticate usernames. Beware.`)
			logger(1, `While this makes the game possible to play without internet access, it also opens up the ability for hackers to connect with any username they choose.`)
			logger(1, `To change this, set "online-mode" to "true" in the config file.`)
		}
		if(!this.encryption)
		{
			logger(1, `**** ENCRYPTION IS DISABLED`)
			logger(1, `The server will don't encrypt any packet. This makes server insecure!`)
			logger(1, `If you are using like password authentication then everyone can steal password!`)
			logger(1, `To change this, set "encryption" to "true" in the config file.`)
		}
		logger(0, `Preparing world "null"`)
		
		//function addTime() { API.time.set(th, API.time.get(th) + 1) }
		//setInterval(addTime, 1000/20)
		
		for(let x=-server.viewDistance; x<=server.viewDistance; x++)
		{
			for(let z=-server.viewDistance; z<=server.viewDistance; z++)
			{
				//API.chunks.load(server, x, z)
				//console.log(API.chunks)
				API.chunks.load(server, x, z)
			}
		}
		
		logger(0, `Loading plugins`)
		this.loadPlugins()
		
		let t2 = performance.now();
		logger(0, `Done (${Math.round(t2-t1)}ms)! For help, type "help"`)
		// Event handler
		this.server.on('login', function (client)
		{
			for(let pl in th.plugins) { if(th.plugins[pl].beforeJoin == undefined) { continue; } try { th.plugins[pl].beforeJoin(player) } catch (e) { logger(2, `Could not pass event beforeJoin in ${pl}.js\n${e}`) } }
			
			if(this.playerCount > this.maxPlayers) { client.end(th.messages.maxPlayers) }
			let player = new API.entities.player(client)
			th.entities.player.push(player)
			API.packets.p_login(server, player)
			
			for(let pl in th.plugins) { if(th.plugins[pl].afterJoin == undefined) { continue; } try { th.plugins[pl].afterJoin(player) } catch (e) { logger(2, `Could not pass event afterJoin in ${pl}.js\n${e}`) } }
			
			
			client.on('packet', function(json, metadata, buffer)
			{
				if(['position', 'keep_alive'].includes(metadata.name) > 0) return
				console.log(json, metadata, buffer)
			})
			
			client.on('set_creative_slot', function(packet) { for(let pl in th.plugins) { if(th.plugins[pl].beforeSetCreativeSlot == undefined) { continue; } try { th.plugins[pl].beforeSetCreativeSlot(player) } catch (e) { logger(2, `Could not pass event beforeSetCreativeSlot in ${pl}.js\n${e}`) } } API.packets.p_set_creative_slot(server, player, packet); for(let pl in th.plugins) { if(th.plugins[pl].afterSetCreativeSlot == undefined) { continue; } try { th.plugins[pl].afterSetCreativeSlot(player) } catch (e) { logger(2, `Could not pass event afterSetCreativeSlot in ${pl}.js\n${e}`) } } })
			client.on('held_item_slot', function(packet) { for(let pl in th.plugins) { if(th.plugins[pl].beforeChangeHeldItemSlot == undefined) { continue; } try { th.plugins[pl].beforeChangeHeldItemSlot(player) } catch (e) { logger(2, `Could not pass event beforeChangeHeldItemSlot in ${pl}.js\n${e}`) } } API.packets.p_held_item_slot(server, player, packet); for(let pl in th.plugins) { if(th.plugins[pl].afterChangeHeldItemSlot == undefined) { continue; } try { th.plugins[pl].afterChangeHeldItemSlot(player) } catch (e) { logger(2, `Could not pass event afterChangeHeldItemSlot in ${pl}.js\n${e}`) } } })
			client.on('block_dig', function(packet) { for(let pl in th.plugins) { if(th.plugins[pl].beforeBlockBreak == undefined) { continue; } try { th.plugins[pl].beforeBlockBreak(player) } catch (e) { logger(2, `Could not pass event beforeBlockBreak in ${pl}.js\n${e}`) } } API.packets.p_block_dig(server, player, packet); for(let pl in th.plugins) { if(th.plugins[pl].afterBlockBreak == undefined) { continue; } try { th.plugins[pl].afterBlockBreak(player) } catch (e) { logger(2, `Could not pass event afterBlockBreak in ${pl}.js\n${e}`) } } })
			client.on('teleport_confirm', function(packet) { for(let pl in th.plugins) { if(th.plugins[pl].beforeTeleportConfirm == undefined) { continue; } try { th.plugins[pl].beforeTeleportConfirm(player) } catch (e) { logger(2, `Could not pass event beforeTeleportConfirm in ${pl}.js\n${e}`) } } API.packets.p_teleport_confirm(server, player, packet); for(let pl in th.plugins) { if(th.plugins[pl].afterTeleportConfirm == undefined) { continue; } try { th.plugins[pl].afterTeleportConfirm(player) } catch (e) { logger(2, `Could not pass event afterTeleportConfirm in ${pl}.js\n${e}`) } } })
			
			client.on('chat', function(packet)
			{
				if(packet.message.startsWith('/')) { for(let pl in th.plugins) { if(th.plugins[pl].beforeCommand == undefined) { continue; } try { th.plugins[pl].beforeCommand(player) } catch (e) { logger(2, `Could not pass event beforeCommand in ${pl}.js\n${e}`) } } API.packets.p_command(server, player, packet); for(let pl in th.plugins) { if(th.plugins[pl].afterCommand == undefined) { continue; } try { th.plugins[pl].afterCommand(player) } catch (e) { logger(2, `Could not pass event afterCommand in ${pl}.js\n${e}`) } }
				} else { for(let pl in th.plugins) { if(th.plugins[pl].beforeMessage == undefined) { continue; } try { th.plugins[pl].beforeMessage(player) } catch (e) { logger(2, `Could not pass event beforeMessage in ${pl}.js\n${e}`) } } API.packets.p_message(server, player, packet); for(let pl in th.plugins) { if(th.plugins[pl].afterMessage == undefined) { continue; } try { th.plugins[pl].afterMessage(player) } catch (e) { logger(2, `Could not pass event afterMessage in ${pl}.js\n${e}`) } } }
			})
			client.on('position', function(packet) { for(let pl in th.plugins) { if(th.plugins[pl].beforePlayerMovement == undefined) { continue; } try { th.plugins[pl].beforePlayerMovement(player, packet.x, packet.y, packet.z, packet.onGround) } catch (e) { logger(2, `Could not pass event beforePlayerMovement in ${pl}.js\n${e}`) } } API.packets.p_position(server, player, packet); for(let pl in th.plugins) { if(th.plugins[pl].afterPlayerMovement == undefined) { continue; } try { th.plugins[pl].afterPlayerMovement(player, packet.x, packet.y, packet.z, packet.onGround) } catch (e) { logger(2, `Could not pass event afterPlayerMovement in ${pl}.js\n${e}`) } } })
			
			
			client.on('look', function(packet) { for(let pl in th.plugins) { if(th.plugins[pl].beforePlayerRotate == undefined) { continue; } try { th.plugins[pl].beforePlayerRotate(player, packet.yaw, packet.pitch, packet.onGround) } catch (e) { logger(2, `Could not pass event beforePlayerRotate in ${pl}.js\n${e}`) } } API.packets.p_look(server, player, packet); for(let pl in th.plugins) { if(th.plugins[pl].afterPlayerRotate == undefined) { continue; } try { th.plugins[pl].afterPlayerRotate(player, packet.yaw, packet.pitch, packet.onGround) } catch (e) { logger(2, `Could not pass event afterPlayerRotate in ${pl}.js\n${e}`) } } })
			
			client.on('position_look', function(packet) { for(let pl in th.plugins) { if(th.plugins[pl].beforePlayerMovement == undefined) { continue; } try { th.plugins[pl].beforePlayerMovement(player, packet.x, packet.y, packet.z, packet.onGround) } catch (e) { logger(2, `Could not pass event beforePlayerMovement in ${pl}.js\n${e}`) } } API.packets.p_position(server, player, packet); for(let pl in th.plugins) { if(th.plugins[pl].afterPlayerMovement == undefined) { continue; } try { th.plugins[pl].afterPlayerMovement(player, packet.x, packet.y, packet.z, packet.onGround) } catch (e) { logger(2, `Could not pass event afterPlayerMovement in ${pl}.js\n${e}`) } }
			for(let pl in th.plugins) { if(th.plugins[pl].beforePlayerRotate == undefined) { continue; } try { th.plugins[pl].beforePlayerRotate(player, packet.yaw, packet.pitch, packet.onGround) } catch (e) { logger(2, `Could not pass event beforePlayerRotate in ${pl}.js\n${e}`) } } API.packets.p_look(server, player, packet); for(let pl in th.plugins) { if(th.plugins[pl].afterPlayerRotate == undefined) { continue; } try { th.plugins[pl].afterPlayerRotate(player, packet.yaw, packet.pitch, packet.onGround) } catch (e) { logger(2, `Could not pass event afterPlayerRotate in ${pl}.js\n${e}`) } } })
			
			client.on('entity_action', function(packet) { for(let pl in th.plugins) { if(th.plugins[pl].beforeEntityAction == undefined) { continue; } try { th.plugins[pl].beforeEntityAction(player, packet.entityId, packet.actionId, packet.jumpBoost) } catch (e) { logger(2, `Could not pass event beforeEntityAction in ${pl}.js\n${e}`) } } API.packets.p_entity_action(server, player, packet); for(let pl in th.plugins) { if(th.plugins[pl].afterEntityAction == undefined) { continue; } try { th.plugins[pl].afterEntityAction(player, packet.entityId, packet.actionId, packet.jumpBoost) } catch (e) { logger(2, `Could not pass event afterEntityAction in ${pl}.js\n${e}`) } } })
			
			client.on('block_place', function(packet)
			{
				const event = 'onBlockPlace';
				for(let pl in th.plugins)
				{
					if(th.plugins[pl].onBlockPlace == undefined) continue
					//try { th.plugins[pl].onBlockPlace(player, packet.hand, packet.location, packet.direction, {x: packet.cursorX, y: packet.cursorY, z: packet.cursorZ}, packet.insideBlock) } catch (e) { logger(2, `Could not pass event ${event} in ${pl}.js\n${e}`) }
					th.plugins[pl].onBlockPlace(player, packet.hand, packet.location, packet.direction, {x: packet.cursorX, y: packet.cursorY, z: packet.cursorZ}, packet.insideBlock)
				}
				
				//for(let cl in th.entities.player)
				//{
					/*console.log(th.entities.player[cl].position)
					if(Math.sqrt( (th.entities.player[cl].position.x-packet.location.x)*(th.entities.player[cl].position.x-packet.location.x) + (th.entities.player[cl].position.y-packet.location.y)*(th.entities.player[cl].position.y-packet.location.y) ) < server.viewDistance*16)
					{
						th.entities.player[cl].client.write('block_change',
						{
							location: packet.location
							type: minecraftData.blocksByName.stone.id
						})
						console.log(`sending block change to ${th.entities.player[cl].username}`)
					}
				}*/
			})
		})
	}
	
	stop()
	{
		const th = this
		logger(0, 'Stopping server...')
		for(let pl in th.plugins)
		{
			try
			{
				th.plugins[pl].onDisable()
			}
			catch (e)
			{
				logger(2, `Could not pass event ${event} in ${pl}.js\n${e}`)
				logger(2, `You should contant with author of ${pl}.js!`)
			}
		}
		logger(0, 'Server stopped')
		process.exit()
	}
	
	loadPlugins()
	{
		let npath = __dirname + '/plugins';
		
		let th = this;
		fs.readdirSync(npath).forEach(function(file)
		{
			let t1 = performance.now();
			logger(0, `Loading plugin ${file}`)
			let f = file.replace('.js', '')
			th.plugins[f] = require("./plugins/" + file);
			th.plugins[f].onEnable(th)
			let t2 = performance.now();
			logger(0, `Loaded plugin ${file} in ${Math.round(t2-t1)} ms`)
		})
	}
}

logger(0, "Loading configuration")
let configuration = null
function loadConfig()
{
	try
	{
		configuration = JSON.parse(fs.readFileSync('./config.json', 'utf8'));  // reading configuration
	} catch(err) {
		if(err.errno == -2 && err.syscall == 'open' && err.code == 'ENOENT') // not exists
		{
			logger(1, 'Creating configuration file');
			fs.writeFileSync('./config.json', '{\n	"comment": "Numbers have to be inside quotation marks",\n	"main": {\n		"maxPlayers": "1",\n		"IP": "",\n		"port": "25565",\n		"worldName": "notImplemented",\n		"viewDistance": "6",\n		"onlineMode": false,\n		"encryption": false,\n		"motd": "This is lakkit!"\n	},\n	"messages": {\n		"maxPlayers": "Sorry, but max players has got reached. Try again later!",\n		"unknownCommand": "Unknown command. Type \"/help\" for help."\n	}\n}')
			loadConfig()
		}
		else { logger(2, 'Error while loading config.json'); logger(2, err); process.exit() } // configuration seems to be broken OR no permission to write OR any other error
	}
}

loadConfig()
server = new Server(undefined, configuration.main.IP ? "" : undefined, configuration.main.port, configuration.main.onlineMode, configuration.main.encryption, configuration.main.motd, parseInt(configuration.main.viewDistance), parseInt(configuration.main.maxPlayers), configuration.messages.maxPlayers)
server.start()

delete configuration

readline.on('SIGINT', () => { readline.close(); server.stop() })
readline.on('SIGTSTP', () => { readline.close(); server.stop() })

const consoleReader = function()
{
	readline.question('> ', function(cmd)
	{
		if(cmd == 'stop') { readline.close(); server.stop() }
		if(cmd == 'reload')
		{
			for(let pl in server.plugins)
			{
				server.plugins[pl].onDisable()
				delete require.cache[require.resolve(`./plugins/${pl}.js`)]
			}
			server.plugins = {}
			server.loadPlugins()
		}
		logger(0, `Server used command ${cmd}`)
		consoleReader()
	})
}

consoleReader()


//} catch(e) { logger(2, e); server.stop(); }
} else { console.log(`worker but in main process`) }
