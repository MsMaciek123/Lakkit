module.exports = function(server, player, packet)
{
	if(player.entityId != packet.entityId) { server.libraries['API'].logger(2, `Player entityid ${player.entityId} isn't matching packet entityId ${packet.entityId}. See p_entity_action.js for more informations! PLEASE REPORT IT IMEDITALLY! (idk how to write it xd, just now)`) }
	//if(packet.actionId == 0) //start crouching
	// == 1 stop crouching
	// value 0
	// also hide nick by seding isChroucing byte
	if(packet.actionId == 0) // start sneaking
	{
		player.isSneaking = true
		player.sendPacketNearby('entity_metadata', {
			entityId: player.entityId,
			metadata:
			{ 0: { key: 6, type: 18, value: 3 } }
		}, true)
	}
	else if(packet.actionId == 1) // stop sneaking (back to normal position?)
	{
		player.isSneaking = false
		player.sendPacketNearby('entity_metadata', {
			entityId: player.entityId,
			metadata:
			{ 0: { key: 6, type: 18, value: 0 } }
		}, true)
	}
	/*player.sendPacketNearby('entity_metadata', {
		entityId: player.entityId,
		metadata: //https://wiki.vg/Entity_metadata#Entity_Metadata_Format
		{
			0: {
				key: 6, // index from entity THe base class. (points to Pose)
				type: 18, // id of type in type field below entity metadata format header
				value: 5 //see notes from type Pose below entity metadata format header to know more
			}
		}
	})*/
}
