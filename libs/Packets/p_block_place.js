module.exports = function(server, player, packet)
{
	let minecraftData = server.libraries['minecraft-data']
	let vec3 = server.libraries['minecraft-data']
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
		
		switch(itemId)
		{
			case 716:
				server.chunks[API.chunks.id(LocChunk.x, LocChunk.z)].setBlockType(new Vec3(correctLocation.x-(LocChunk.x*16), correctLocation.y, correctLocation.z-(LocChunk.z*16)), 0)
				server.chunks[API.chunks.id(LocChunk.x, LocChunk.z)].setBlockData(new Vec3(correctLocation.x-(LocChunk.x*16), correctLocation.y, correctLocation.z-(LocChunk.z*16)), blockStateId)
				break;
		}
		
		if(blockStateId == undefined || blockStateId == 0) return
					
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
		
		server.chunks[API.chunks.id(LocChunk.x, LocChunk.z)].setBlockType(new Vec3(correctLocation.x-(LocChunk.x*16), correctLocation.y, correctLocation.z-(LocChunk.z*16)), 0)
		server.chunks[API.chunks.id(LocChunk.x, LocChunk.z)].setBlockData(new Vec3(correctLocation.x-(LocChunk.x*16), correctLocation.y, correctLocation.z-(LocChunk.z*16)), blockStateId)
	} catch (e) {
		player.client.write('block_change',
		{
			location: correctLocation,
			type: 0 // remove block from client side
		})
	}
}
