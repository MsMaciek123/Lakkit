module.exports = {
	send: function(player, _header='', _footer='')
	{
		player.client.write('playerlist_header',
		{
			header: JSON.stringify({ text: _header }),
			footer: JSON.stringify({ text: _footer })
		})
	}
}
