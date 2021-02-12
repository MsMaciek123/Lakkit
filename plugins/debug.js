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
	
	static onBlockBreak(player, location, blockFace)
	{
		
	}
	
	static onBlockPlace(player, hand, location, direction, cursorXYZ, insideBlock)
	{
		
		let correctLocation = location
		switch(direction)
		{
			case 0: correctLocation.y -= 1; break
			case 1: correctLocation.y += 1; break
			case 2: correctLocation.z -= 1; break
			case 3: correctLocation.z += 1; break
			case 4: correctLocation.x -= 1; break
			case 5:	correctLocation.x += 1; break
		}
		
		try
		{
			let itemId = player.inventory.data[player.heldSlot+36].itemId
			console.log(`ITEMID: ${itemId}`)
			console.log(itemId)
			if(itemId == undefined) return
			let blockStateId = 0

			// lava and water
			if(itemId == 661) { blockStateId = 34 }
			else if(`${itemId}` == 662) { blockStateId = 50 }
			else { blockStateId = minecraftData.blocksByName[minecraftData.findItemOrBlockById(itemId).name].defaultState }
			
			if(blockStateId == undefined || blockStateId == 0) return
			
			//let blockStateOffset = 0
			
			API.logger(0, `[${pluginName}] ${player.client.username} postawil blok ${minecraftData.findItemOrBlockById(itemId).name} na ${JSON.stringify(location)}`)
			
			/*if(['lever'].includes(minecraftData.findItemOrBlockById(itemId).name))
			{
				console.log(minecraftData.blocksByName[minecraftData.findItemOrBlockById(itemId).name])
				blockStateId = minecraftData.blocksByName[minecraftData.findItemOrBlockById(itemId).name].defaultState//.minStateId
				switch(direction)
				{
					case 0: blockStateOffset += 17; break
					case 1: blockStateOffset += 1; break //ok
					case 2: blockStateOffset += 9; break //ok
					case 3: blockStateOffset += 11; break //ok
					case 4: blockStateOffset += 13; break //ok
					case 5:	blockStateOffset += 15; break //ok
				}
			}*/
						
			player.client.write('block_change',
			{
				location: location,
				type: minecraftData.blocksByName.air.id
			})
			
			
			for(let cl in server.entities.player)
			{
				server.entities.player[cl].client.write('block_change',
				{
					location: correctLocation,
					type: blockStateId
				})
			}
			
			let LocChunk = API.chunks.calculateLocation(correctLocation.x, correctLocation.z)
			
			//server.chunks[API.chunks.id(LocChunk.x, LocChunk.z)].setBlockType(new Vec3(correctLocation.x-(LocChunk.x*16), correctLocation.y, correctLocation.z-(LocChunk.z*16)), blockStateId)
			server.chunks[API.chunks.id(LocChunk.x, LocChunk.z)].setBlockData(new Vec3(correctLocation.x-(LocChunk.x*16), correctLocation.y, correctLocation.z-(LocChunk.z*16)), blockStateId)
		} catch (e) {
			player.client.write('block_change',
			{
				location: correctLocation,
				type: 0 // remove block from client side
			})
		}
	}

}
module.exports = PluginDebug
