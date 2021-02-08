module.exports = {
	// name - \x06lakkit
	// \xHEXNAME
	// 00-09, then 0A 0B 0C 0D 0E 0F etc. (not 0G, see how hex works)
	send: function(player, name)
	{
		player.client.write('custom_payload',
		{
			channel:'minecraft:brand',
			data: new Buffer.from(name)
		})
	}
}
