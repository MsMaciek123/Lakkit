function get(server)
{
	return server.time
}

function set(server, newTime)
{
	server.time = parseInt(newTime % 24000)
	for(let pl in server.entities.player)
	{
		server.entities.player[pl].client.write('update_time',
		{
			age: [0, 0],
			time: [0, server.time]
		})
	}
}

module.exports = { get, set }
