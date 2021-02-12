module.exports = function(server, player, packet)
{
	let API = server.libraries.API
	let LocChunkLast = API.chunks.calculateLocation(player.position.x, player.position.z)
	let xChunkLast = LocChunkLast.x
	let zChunkLast = LocChunkLast.z
	
	// help function
	function sendChunk(player, chunk, xl, zl)
	{
		if(server.chunks[API.chunks.id(xl, zl)] == undefined) { server.chunks[API.chunks.id(xl, zl)] = API.chunks.chunkAt(server, server.libraries['minecraft-data'].blocksByName.grass_block.id, xChunkNow, zChunkNow);}
		chunk = API.chunks.atLocation(server, xl, zl)
		player.client.write('map_chunk', {
			x: xl,
			z: zl,
			groundUp: true,
			biomes: chunk.dumpBiomes !== undefined ? chunk.dumpBiomes() : undefined,
			heightmaps: {
				type: 'compound',
				name: '',
				value: {
					MOTION_BLOCKING: { type: 'longArray', value: new Array(36).fill([0, 0]) }
				}
			}, // send fake heightmap
			bitMap: chunk.getMask(),
			chunkData: chunk.dump(),
			blockEntities: []
		})
	}
	
	player.sendPacketNearby('entity_teleport',
	{
		entityId: player.entityId,
		x: packet.x,
		y: packet.y,
		z: packet.z,
		yaw: player.rotation.yaw,
		pitch: player.rotation.pitch,
		onGround: packet.onGround
	})
	
	player.position.x = packet.x
	player.position.y = packet.y
	player.position.z = packet.z
	
	let LocChunkNow = API.chunks.calculateLocation(player.position.x, player.position.z)
	let xChunkNow = LocChunkNow.x
	let zChunkNow = LocChunkNow.z
	
	//xChunkLast = parseInt(xChunkLast); xChunkNow = parseInt(xChunkNow); zChunkLast = parseInt(zChunkLast); zChunkNow = parseInt(zChunkNow); 
	
	//console.log(`Player moved from chunk ${xChunkLast} ${zChunkLast} to ${xChunkNow} ${zChunkNow}`)
	
	/*if(xChunkLast != xChunkNow || zChunkLast != zChunkNow)
	{
		console.log(xChunkLast, xChunkNow, zChunkLast, zChunkNow)
		let chunk = API.chunks.chunkAt(server, server.libraries['minecraft-data'].blocksByName.grass_block.id)
		sendChunk(player, chunk, xChunkNow, zChunkNow)
	}*/
	
	function updateViewPosition(player, x, z)
	{
		//sendChunk(player, API.chunks.chunkAt(server, server.libraries['minecraft-data'].blocksByName.grass_block.id), x, z)
		player.client.write('update_view_position', {
			chunkX: x,
			chunkZ: z
		})
	}
	
	const i = 1
	if(xChunkLast < xChunkNow)
	{
		//let chunk = API.chunks.chunkAt(server, server.libraries['minecraft-data'].blocksByName.grass_block.id, xChunkNow, zChunkNow)
		for(let j=0; j<=server.viewDistance; j++)
		{ sendChunk(player, API.chunks.chunkAt(server, xChunkNow+j, zChunkNow-server.viewDistance+j), xChunkNow+j, zChunkNow-server.viewDistance+j) }
		
		for(let j=0; j<server.viewDistance; j++)
		{ sendChunk(player, API.chunks.chunkAt(server, xChunkNow+j, zChunkNow-server.viewDistance-j), xChunkNow+j, zChunkNow+server.viewDistance-j) }
		
		updateViewPosition(player, xChunkNow, zChunkNow)
	}
	
	if(xChunkLast > xChunkNow)
	{
		//let chunk = API.chunks.chunkAt(server, server.libraries['minecraft-data'].blocksByName.grass_block.id, xChunkNow, zChunkNow)
		for(let j=0; j<=server.viewDistance; j++)
		{ sendChunk(player, API.chunks.chunkAt(server, xChunkNow-j, zChunkNow-server.viewDistance+j), xChunkNow-j, zChunkNow-server.viewDistance+j) }
		
		for(let j=0; j<server.viewDistance; j++)
		{
			sendChunk(player, API.chunks.chunkAt(server, xChunkNow-j, zChunkNow+server.viewDistance-j), xChunkNow-j, zChunkNow+server.viewDistance-j)
		}
		
		updateViewPosition(player, xChunkNow, zChunkNow)
	}
	
	if(zChunkLast < zChunkNow)
	{
		//let chunk = API.chunks.chunkAt(server, server.libraries['minecraft-data'].blocksByName.grass_block.id, xChunkNow, zChunkNow)
		for(let j=0; j<=server.viewDistance; j++)
		{ sendChunk(player, API.chunks.chunkAt(server, xChunkNow-server.viewDistance+j, zChunkNow+j), xChunkNow-server.viewDistance+j, zChunkNow+j) }
		
		for(let j=0; j<server.viewDistance; j++)
		{ sendChunk(player, API.chunks.chunkAt(server, xChunkNow+j, zChunkNow+server.viewDistance-j), xChunkNow+j, zChunkNow+server.viewDistance-j) }
		
		updateViewPosition(player, xChunkNow, zChunkNow)
	}
	
	if(zChunkLast > zChunkNow)
	{
		//let chunk = API.chunks.chunkAt(server, server.libraries['minecraft-data'].blocksByName.grass_block.id, xChunkNow, zChunkNow)
		for(let j=0; j<=server.viewDistance; j++)
		{ sendChunk(player, API.chunks.chunkAt(server, xChunkNow-server.viewDistance+j, zChunkNow-j), xChunkNow-server.viewDistance+j, zChunkNow-j) }
		
		for(let j=0; j<server.viewDistance; j++)
		{ sendChunk(player, API.chunks.chunkAt(server, xChunkNow+server.viewDistance-j, zChunkNow-j), xChunkNow+server.viewDistance-j, zChunkNow-j) }
		
		updateViewPosition(player, xChunkNow, zChunkNow)
	}
} 
