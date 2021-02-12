const Vec3 = require('vec3')
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
	seed = 100
	
	const chunkBlocksTOP = []
	let xx = _x
	let zz = _z

	for(let x=0; x<16; x++)
	{
		for(let z=0; z<16; z++)
		{
			let increment = 0
			for(let y = 0; y < 1; y++)
			{		
				for(let y=0; y<256; y++)
				{
					chunk.setSkyLight(new Vec3(x,y,z), 15) //was 15
				}
				
				let worldX = x + _x*16
				let worldY = y
				let worldZ = z + _z*16
				
				let generatedY1 = generateHeight(worldX, worldZ, _increment)
				let generatedY2 = generateHeight(worldX, worldZ, 0.07)
				let generatedY = parseInt((generatedY1 + generatedY2) / 2)+11
				var offset = 0;
				var maxHeight = 32;
				var _increment = 0.035;

				chunkBlocksTOP.push(generatedY)
				
				function Map(from,to,from2,to2,value)
				{
					if(value <= from2) return from
					if(value >= to2) return to
					
					return (to-from) * ((value-from2) / (to2-from2)) + from
				}
				
				function generateHeight(x, z, increment)
				{
					let height = perlinNoise(x*increment + offset, z*increment + offset);
					height = Map(1, maxHeight, 0, 1, height)
					return height
				}
				
				function perlinNoise(x, z)
				{
					let height = noise.perlin2(x, z)
					return height
				}
				
				chunk.setBlockType(new Vec3(x, generatedY, z), 8) 
				chunk.setBlockData(new Vec3(x, generatedY, z), 1)
				
				// chance to generate tree
				//console.log((seed%worldX) + (seed%worldZ))
				if(((seed%worldX) + (seed%worldZ))%16 > 14 && generatedY > 14)
				{
					chunk.setBlockType(new Vec3(x, generatedY+1, z), 1)
					chunk.setBlockData(new Vec3(x, generatedY+1, z), 1)
				}
			}
		}
	}
	const dataBlocks = []
	
	for(let x = 0; x<16; x++)
	{
		for(let y = 0; y < 14; y++)
		{
			for(let z=0; z<16; z++)
			{
				if(chunk.getBlock(new Vec3(x,y,z)).stateId==0 || chunk.getBlock(new Vec3(x,y,z)).stateId=="0"){
					chunk.setBlockType(new Vec3(x, y, z), 26) 
					chunk.setBlockData(new Vec3(x, y, z), 0)
				}
				
			}
		}
	}

	/*let ManyTrees = 8//(seed%(_x+_z))
	//console.log("jdd",ManyTrees)

	let chunkTreesVectors = []
	for(let i = 0; i < ManyTrees; i++){
		console.log(_x,_z)
		let ___x = Math.abs(parseInt(Math.random()*_x))%16
		let ___z = Math.abs(parseInt(Math.random()*_z))%16
		if(___x <= 3){
			___x = 4
		}
		else if(___x >= 13){
			___x = 12
		}
		else if(___z <= 3){
			___z = 4
		}
		else if(___z >= 13){
			___z = 12
		}

		let ___y = chunkBlocksTOP[Math.abs((___x-1) * 16 + (___z))] // y

		if(chunk.getBlock(new Vec3(___x,___y,___z)).stateId == "26"){
			continue;
		}
		else if(chunk.getBlock(new Vec3(___x,___y-1,___z)).stateId == "0"){
			continue;
		}

		for(let j = 0; j < 5; j++){
			chunk.setBlockType(new Vec3(___x, parseInt(___y)+j, ___z), 35) 
			chunk.setBlockData(new Vec3(___x, parseInt(___y)+j, ___z), 1)	
		}

		for(let y____ = 0; y____ < 2; y____++){
			for(let x____ = 0; x____ < 5; x____++){
				for(let z____ = 0; z____ < 5; z____++){
					chunk.setBlockType(new Vec3(___x-2+x____, parseInt(___y)+5+y____, ___z-2+z____), 59) 
					chunk.setBlockData(new Vec3(___x-2+x____, parseInt(___y)+5+y____, ___z-2+z____), 1)	
				}
			}
		}
		for(let y____ = 0; y____ < 1; y____++){
			for(let x____ = 0; x____ < 3; x____++){
				for(let z____ = 0; z____ < 3; z____++){
					chunk.setBlockType(new Vec3(___x-1+x____, parseInt(___y)+7+y____, ___z-1+z____), 59) 
					chunk.setBlockData(new Vec3(___x-1+x____, parseInt(___y)+7+y____, ___z-1+z____), 1)	
				}
			}
		}
		chunk.setBlockType(new Vec3(___x, parseInt(___y)+8, ___z), 59) 
		chunk.setBlockData(new Vec3(___x, parseInt(___y)+8, ___z), 1)	

		chunk.setBlockType(new Vec3(___x+1, parseInt(___y)+8, ___z), 59) 
		chunk.setBlockData(new Vec3(___x+1, parseInt(___y)+8, ___z), 1)	

		chunk.setBlockType(new Vec3(___x-1, parseInt(___y)+8, ___z), 59) 
		chunk.setBlockData(new Vec3(___x-1, parseInt(___y)+8, ___z), 1)	

		chunk.setBlockType(new Vec3(___x, parseInt(___y)+8, ___z+1), 59) 
		chunk.setBlockData(new Vec3(___x, parseInt(___y)+8, ___z+1), 1)	

		chunk.setBlockType(new Vec3(___x, parseInt(___y)+8, ___z-1), 59) 
		chunk.setBlockData(new Vec3(___x, parseInt(___y)+8, ___z-1), 1)	

	}*/

	

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
