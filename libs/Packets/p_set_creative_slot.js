module.exports = function(server, player, packet)
{
	function clearSlot(id)
	{
		player.inventory.setSlot(player, 0, packet.slot, 0)
		setTimeout(function()
		{
			player.client.write('set_slot',
			{
				windowId: 0,
				slot: id,
				item:
				{
					present: false,
				}
			})
		}, 100)
	}
	
	if(player.gamemode == 1)
	{
		if(packet.item.present == false) { clearSlot(packet.slot); return }
		console.log(server.libraries['minecraft-data'].items[packet.item.itemId].stackSize)
		try {
			if(packet.item.itemCount > server.libraries['minecraft-data'].items[packet.item.itemId].stackSize) { clearSlot(packet.slot) }
			else player.inventory.setSlot(player, 0, packet.slot, packet.item)
		} catch(e) {
			clearSlot(packet.slot)
		}
	}
	else clearSlot(packet.slot)
}
