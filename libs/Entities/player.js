const Entity = require('./entity')
const Inventory = require('./../inventory')

class Player extends Entity
{
	constructor(client)
	{
		super(client.id)
		this.client = client
		this.position = {}
		this.rotation = { yaw: 0, pitch: 0 }
		this.inventory = new Inventory('Inventory', 45)
		this.heldSlot = 0
		this.gamemode = 0
		this.isSneaking = false
	}
	
	sendPacket(name, data)
	{
		this.client.write(name, data)
	}
	
	sendPacketNearby(name, data, sendSelf=false)
	{
		// TODO: loop all players nearby!
		if(sendSelf)
		{
			for(let cl in server.entities.player)
			{
				server.entities.player[cl].sendPacket(name, data)
			}
		}
		else
		{
			for(let cl in server.entities.player)
			{
				if(server.entities.player[cl].client.uuid == this.client.uuid) continue
				server.entities.player[cl].sendPacket(name, data)
			}
		}
	}
	
	setGamemode(id)
	{
		if(id > -1 && id < 4)
		{
			this.gamemode = id
			this.client.write('game_state_change',
			{
				reason: 3,
				gameMode: id
			})
		}
	}
	
	setTitleTimes(_fadeIn=5, _stay=40, _fadeOut=5)
	{
		this.client.write('title',
		{
			action: 3,
			fadeIn: _fadeIn,
			stay: _stay,
			fadeOut: _fadeOut
		})
	}
	
	sendTitle(title)
	{
		this.client.write('title',
		{
			action: 0,
			text: JSON.stringify({ text: title })
		})
	}
	
	sendSubtitle(subtitle)
	{
		this.client.write('title',
		{
			action: 1,
			text: JSON.stringify({ text: subtitle })
		})
	}
	
	sendActionbar(actionbar)
	{
		this.client.write('title',
		{
			action: 2,
			text: JSON.stringify({ text: actionbar })
		})
	}
}

module.exports = Player
