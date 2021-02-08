class Inventory
{
	constructor(name, size)
	{
		this.data = []
		for(let i=0; i<size; i++)
		{
			this.data.push({present: false, itemId: 0, itemCount: 0, NBT: {}})
		}
		this.name = name
	}
	
	setSlot(player, windowID, slotId, slotData)
	{
		player.inventory.data[slotId] = slotData
		player.client.write('set_slot',
		{
			windowId: windowID,
			slot: slotId,
			item: slotData
		})
	}
	
}

module.exports = Inventory
