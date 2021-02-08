module.exports = function(server, player, packet)
{
	// https://stackoverflow.com/questions/11409895/whats-the-most-elegant-way-to-cap-a-number-to-a-segment
	function clamp(num, _min, _max)
	{
		return num <= _min ? _min : num >= _max ? _max : num;
	}
	console.log(packet)
	
	if(packet.yaw < 0)
	{
		packet.yaw += Math.floor(packet.yaw/360)*360
	}
	
	if(packet.yaw > 0)
	{
		console.log(`packet yaw is +`)
		packet.yaw = -packet.yaw - 180
		console.log(`new packet yaw: ${packet.yaw}`)
	}
	player.rotation = { yaw: clamp((Math.abs(packet.yaw))%360*(256/360)-127.5, -127, 127), pitch: packet.pitch }
	//player.rotation = { yaw: (packet.yaw%256), pitch: packet.pitch }
	console.log(`player.rotation: ${JSON.stringify(player.rotation)}`)
	//player.rotation.yaw = Math.round(packet.yaw)
	//player.rotation.pitch = Math.round(packet.pitch)
	player.sendPacketNearby('entity_teleport',
	{
		entityId: player.entityId,
		x: player.position.x,
		y: player.position.y,
		z: player.position.z,
		yaw: player.rotation.yaw,
		pitch: player.rotation.pitch,
		onGround: packet.onGround
	})
	
	player.sendPacketNearby('entity_head_rotation',
	{
		entityId: player.entityId,
		headYaw: player.rotation.yaw,
	})
}
