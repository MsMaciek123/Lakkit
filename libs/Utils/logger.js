const logItEnum = Object.freeze({0: "INFO", 1: "WARNING", 2: "ERROR"})
const logItEnumColors = Object.freeze({0: "", 1: "\x1b[93m", 2: "\033[1;31m"})

function logIt(type, content)
{
	if(type > -1 && type < 3)
	{
		let date = new Date()
		date = date.toTimeString().split(' ')[0];
		console.log(`${logItEnumColors[type]}[${date} ${logItEnum[type]}] ${content}\x1b[0m`)
	}
	else console.log(content)
}

module.exports = logIt
