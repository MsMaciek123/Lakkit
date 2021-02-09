module.exports = function(server, player)
{
	player.entityId += 1
	player.client.entityId += 1
	let API = server.libraries.API
	let loginPacket = server.libraries['minecraft-data'].loginPacket
	player.gamemode = 1; 
	
	player.client.write('login',
	{
		entityId: player.client.entityId,
		isHardcore: false,
		gameMode: player.gamemode,
		previousGameMode: 255,
		worldNames: loginPacket.worldNames,
		dimensionCodec: loginPacket.dimensionCodec,
		dimension: loginPacket.dimension,
		worldName: 'minecraft:overworld',
		hashedSeed: [0, 0],
		maxPlayers: server.maxPlayers,
		viewDistance: server.viewDistance,
		reducedDebugInfo: false,
		enableRespawnScreen: true,
		isDebug: false,
		isFlat: false
	})
	
	// help function
	function sendChunk(player, chunk, xl, zl)
	{
		if(server.chunks[API.chunks.id(xl, zl)] == undefined) { server.chunks[API.chunks.id(xl, zl)] = API.chunks.createExampleChunk(server, minecraftData.blocksByName.grass_block.id);}
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
	
	let chunk = API.chunks.createExampleChunk(server, server.libraries['minecraft-data'].blocksByName.grass_block.id)
	for(let x=-server.viewDistance; x<=server.viewDistance; x++)
	{
		for(let z=-server.viewDistance; z<=server.viewDistance; z++)
		{
			sendChunk(player, chunk, x, z)
		}
	}
	
	player.client.write('update_time',
	{
		age: [0, 0],
		time: [0, API.time.get(server)]
	})
	
	// start position, TODO: get from world
	player.position.x = 15
	player.position.y = 30
	player.position.z = 15
	player.client.write('position', {
		x: player.position.x,
		y: player.position.y,
		z: player.position.z,
		yaw: 137,
		pitch: 0,
		flags: false
	})
	
	
	console.log(`Player: ${player.client.username}; entityId: ${player.entityId}`)
	
	
	
	/*for(let pl in server.entities.player)
	{
		console.log(`sending info about ${server.entities.player[pl].client.username} for ${player.client.username}`)
		player.client.write('player_info', {
			action: 0,
			data:
			[
				{
					UUID: server.entities.player[pl].client.uuid,
					name: server.entities.player[pl].client.username,
					properties: [ ],
					gamemode: 1,
					ping: 1 // not implemented!
				}
			]
		})
		
		// send properties entity (0x58) (empty, because we take default values)
		/*server.entities.player[pl].client.write('entity_update_attributes', {
			entityId: player.entityId,
			properties: [
				1,
				{
					'generic.movement_speed': 0.9
				}
			]
		})*/
		
		// send properties entity (0x58) (empty, because we take default values)
		/*player.client.write('entity_update_attributes', {
			entityId: server.entities.player[pl].entityId,
			properties: {}
		})*/
		
		/*if(server.entities.player[pl].client.uuid == player.client.uuid) continue
		
		console.log(`sending info about ${player.client.username} for ${server.entities.player[pl].client.username}`)
		server.entities.player[pl].client.write('player_info', {
			action: 0,
			data:
			[
				{
					UUID: player.client.uuid,
					name: player.client.username,
					properties: [],
					gamemode: 1,
					ping: 1 // not implemented!
					//displayName: "UnknownPlayer"
				}
			]
		})
		
		server.entities.player[pl].client.write('named_entity_spawn',
		{
			entityId: player.entityId,
			playerUUID: player.client.uuid,
			x: 15,//player.position.x,
			y: 20,//player.position.y,
			z: 15,//player.position.z,
			yaw: 0,
			pitch: 0,
			//headPitch: 0,
			//currentItem: 0,
			//metadata: 0
		})
		console.log(server.entities.player[pl].entityId, server.entities.player[pl].client.uuid)
		player.client.write('named_entity_spawn',
		{
			entityId: server.entities.player[pl].entityId,
			playerUUID: server.entities.player[pl].client.uuid,
			x: 15,//player.position.x,
			y: 20,//player.position.y,
			z: 15,//player.position.z,
			yaw: 0,
			pitch: 0,
			//headPitch: 0,
			//currentItem: 0,
			//metadata: 0
		})
		
		/*player.client.write('spawn_entity_living',
		{
			entityId: server.entities.player[pl].entityId,
			playerUUID: server.entities.player[pl].client.uuid,
			type: 106, //player
			x: server.entities.player[pl].position.x,
			y: server.entities.player[pl].position.y,
			z: server.entities.player[pl].position.z,
			yaw: 0,
			pitch: 0,
			headPitch: 0,
			velocityX: 0,
			velocityY: 0,
			velocityZ: 0
		})*/
		
		/*console.log(`Spawning ${player.client.username} for ${server.entities.player[pl].client.username}`)
		server.entities.player[pl].client.write('named_entity_spawn',
		{
			entityId: player.entityId,
			playerUUID: player.client.uuid,
			x: player.position.x,
			y: player.position.y,
			z: player.position.z,
			yaw: 0,
			pitch: 0
		})
		
		player.client.write('named_entity_spawn',
		{
			entityId: server.entities.player[pl].entityId,
			playerUUID: server.entities.player[pl].client.uuid,
			x: server.entities.player[pl].position.x,
			y: server.entities.player[pl].position.y,
			z: server.entities.player[pl].position.z,
			yaw: 0,
			pitch: 0
		})*/
	//}//*/
	
	/*server.entities.player[0].client.write('named_entity_spawn',
	{
		entityId: player.entityId,
		playerUUID: player.client.uuid,
		x: player.position.x,
		y: player.position.y,
		z: player.position.z,
		yaw: 0,
		pitch: 0
	})*/
	
	
	for(let pl in server.entities.player)
	{
		console.log(player.client.uuid, player.client.username, server.entities.player[pl].client.uuid, server.entities.player[pl].client.username)
		server.entities.player[pl].client.write('player_info', {
			action: 0,
			data:
			[
				{
					UUID: player.client.uuid,
					name: player.client.username,
					properties: [ ],
					gamemode: 1,
					ping: 1 // not implemented!
				}
			]
		})
		
		if(server.entities.player[pl].client.uuid == player.client.uuid) { continue }
		
		player.client.write('player_info', {
			action: 0,
			data:
			[
				{
					UUID: server.entities.player[pl].client.uuid,
					name: server.entities.player[pl].client.username,
					properties: [ ],
					gamemode: 1,
					ping: 1 // not implemented!
				}
			]
		})
		
		server.entities.player[pl].client.write('named_entity_spawn',
		{
			entityId: player.entityId,
			playerUUID: player.client.uuid,
			x: player.position.x,
			y: player.position.y,
			z: player.position.z,
			yaw: 0,
			pitch: 0,
			headPitch: 0,
			currentItem: 0,
			metadata: 0
		})
		
		player.client.write('named_entity_spawn',
		{
			entityId: server.entities.player[pl].entityId,
			playerUUID: server.entities.player[pl].client.uuid,
			x: player.position.x,
			y: player.position.y,
			z: player.position.z,
			yaw: 0,
			pitch: 0,
			headPitch: 0,
			currentItem: 0,
			metadata: 0
		})
	}
	
}
