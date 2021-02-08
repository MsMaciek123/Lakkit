module.exports = function(server, player, packet)
{
	let Vec3 = server.libraries.vec3
	let API = server.libraries.API
	for(let cl in server.entities.player)
	{
		//TODO: loop all players around (in radius server.viewDistance chunks) player that breaked the block instaed of looping all players on the server
		server.entities.player[cl].client.write('block_change',
		{
			location: packet.location,
			type: server.libraries['minecraft-data'].blocksByName.air.id
		})
	}
	let LocChunk = API.chunks.calculateLocation(packet.location.x, packet.location.z)
	server.chunks[API.chunks.id(LocChunk.x, LocChunk.z)].setBlockType(new Vec3(packet.location.x-(LocChunk.x*16), packet.location.y, packet.location.z-(LocChunk.z*16)), server.libraries['minecraft-data'].blocksByName.air.id)
}
