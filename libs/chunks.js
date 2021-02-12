const Vec3 = require('vec3')
const API = require("./api.js")
const options = require("./genrator/generator-settings.json")
function calculateLocation(x, z)
{
	let xl = x/16
	let zl = z/16
	// Change -0 to -1
	if(xl<0) xl-=1
		if(zl<0) zl-=1
			
			return({x: parseInt(xl), z: parseInt(zl)})
}

function atLocation(server, x, z)
{
	return(server.chunks[id(x,z)])
}

function id(x, z)
{
	return JSON.stringify([x,z])
}

function isLoaded(server, x, z)
{
	return (server.chunks[id(x,z)] != undefined )
}

function chunkAt(server, x, z)
{
	
	if(!isLoaded(server, x, z)) server.libraries['API'].chunks.load(server, x, z)
		return(server.chunks[id(x,z)])
}

function load(server, x, z)
{
	// TODO: check file
	server.chunks[id(x,z)] = createExampleChunk(server, 0, x, z, server.seed)
}

function createExampleChunk(server, block, _x, _z, seed)
{
	const chunk = new server.libraries['prismarine-chunk']()
	const Noise = require('noisejs')
	var noise = new Noise.Noise(100)
	seed = seed
	
	const chunkBlocksTOP = []
	let xx = _x
	let zz = _z
	
	let chunkSeed = parseInt(seed * ((_x*xx)**(_z/zz)/(seed*xx)-(seed*zz)))
	
	// generator
	const ___ = require("./genrator/generator")
	//const ___ = require("./genrator/new")
	___(xx,0,zz,chunkSeed,chunk,seed,noise, _x, _z, chunkBlocksTOP, options)
	
	return(chunk)
}

function generateXZTreeVector(){
	__x = parseInt(Math.random()* 16)
	__z = parseInt(Math.random()* 16)
}

function setBlock(chunkx, y, z, type, data=0)
{
	
}

module.exports = { createExampleChunk, calculateLocation, atLocation, id, setBlock, isLoaded, load, chunkAt }   
