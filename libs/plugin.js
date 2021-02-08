class Plugin
{
	static onEnable(server)
	{
		console.log(`Plugin enabled with server instance:`, server.name)
	}
	
	static onDisable(server)
	{
		console.log(`Plugin disabled`)
	}
}
module.exports = Plugin
