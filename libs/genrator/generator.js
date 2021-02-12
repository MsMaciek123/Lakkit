const Vec3 = require('vec3')
module.exports = (x,y,z,chunkSeed,chunk,seed,noise, _x, _z, chunkBlocksTOP,options) => {
    	//console.log(chunkSeed)

	var offset = seed
	var maxHeight = 64;
	var _increment = 0.035;
	let caveIncrement = 0.08;
	let caveOffset = seed

	let itc = 0

	let riverMin = options.overworld.waterHeight

	const treesVectors = []

	for(let x=0; x<16; x++)
	{
		for(let z=0; z<16; z++)
		{
			let increment = 0
			for(let y = 0; y < 1; y++)
			{		
				
				
				let worldX = x + _x*16
				let worldY = y
				let worldZ = z + _z*16

				//seed = parseInt(Math.random()*2000)
				itc++
				
				let generatedY1 = generateHeight(worldX, worldZ, _increment)
				let generatedY2 = generateHeight(worldX, worldZ, 0.05)
				//let generatedY3 = generateHeight(worldX, worldZ, 0.035)
				let generatedY = parseInt((generatedY1 + generatedY2) / 2 )+33
				

				let caveProbability = 0//calculateCaveProbability(x,y,z)

				chunkBlocksTOP.push(generatedY)
				
				// caves
				function calculateCaveProbability(_worldX,_worldY,_worldZ){
					_worldX = _worldX * caveIncrement + caveOffset
					_worldY = _worldY * caveIncrement + caveOffset
					_worldZ = _worldZ * caveIncrement + caveOffset
					return PerlinNoise3d(_worldX, _worldY, _worldZ)*10
				}
				// perlin

				function PerlinNoise3d(xa,ya,za){
					let XY = perlinNoise(xa,ya)
					let XZ = perlinNoise(xa,za)
					let YZ = perlinNoise(ya,za)

					let YX = perlinNoise(ya,xa)
					let ZX = perlinNoise(za,xa)
					let ZY = perlinNoise(za,ya)

					return (XY * XZ * YZ * YX * ZX * ZY) / 6
				}

				function Map(from,to,from2,to2,value)
				{
					if(value <= from2) return from
					if(value >= to2) return to
					
					return (to-from) * ((value-from2) * (to2-from2)) - from +1
					//with rivers return (to-from) * ((value-from2) * (to2-from2)) / from
				}
				
				function generateHeight(x, z, increment)
				{
					if(x == 0){
						x = 1;
					}
					if(z == 0){
						z = 1;
					}
					let height = perlinNoise((x)*increment + offset ? (x)*increment + offset : 1, (z)*increment + offset ? (z)*increment + offset : 1 );
					height = Map(1, maxHeight, 0, 1, height)
					return height
				}
				
				function perlinNoise(x, z)
				{
					let height = noise.perlin2(x, z)
					return height
				}
				

				for(let i = generatedY; i >= 0; i--){

					if(i <=generatedY){
						//console.log(chunkSeed)
						let warunek = Math.abs((worldX+worldZ)+seed)%256

						// Math.abs((chunkSeed/3)+seed*((_x+_z)+(x+z)))*64%256
						//console.log(warunek)

						if(warunek >= 0 && warunek < 43){
							for(let k = 0; k < 256; k++){
								chunk.setBiome(new Vec3(x,k,z), 4)	
							}
							

							//FOREST
							if(generatedY < riverMin){
								generateRiver(_x,_z,server,seed,chunk, chunkBlocksTOP,generatedY,i,x,z)
							}
							else if(generatedY == riverMin){
								if((((_x-1)*16+x)+((_z-1)*16+z))%16<10){
									chunk.setBlockType(new Vec3(x, i, z), 9) 
									chunk.setBlockData(new Vec3(x, i, z), 0)	
								}
								else{
									chunk.setBlockType(new Vec3(x, i, z), 30) 
									chunk.setBlockData(new Vec3(x, i, z), 0)
								}
								
							}
							else{
								if(generatedY > riverMin+7){
									for(let k = 0; k < 256; k++){
										chunk.setBiome(new Vec3(x,k,z),  18)	
									}
								}
								if(i == generatedY){
									chunk.setBlockType(new Vec3(x, i, z), 8) 
									chunk.setBlockData(new Vec3(x, i, z), 1)	
								}
								else if (i == generatedY - 1 || i == generatedY - 2){
									chunk.setBlockType(new Vec3(x, i, z), 9) 
									chunk.setBlockData(new Vec3(x, i, z), 0)	
								}
								else if (i == generatedY - 3 || i == generatedY - 4){
									if(seed+x+z+_x+_z%2==0){
										chunk.setBlockType(new Vec3(x, i, z), 9) 
										chunk.setBlockData(new Vec3(x, i, z), 0)	
									}
									else{
										chunk.setBlockType(new Vec3(x, i, z), 1) 
										chunk.setBlockData(new Vec3(x, i, z), 0)	
									}
								}
								else{
									chunk.setBlockType(new Vec3(x, i, z), 1) 
									chunk.setBlockData(new Vec3(x, i, z), 0)	
								}	
							}
							

							// trees

							const trees = require("./tree.js");

							if(i<=riverMin){
								let logggg = 0
							}
							else{
								trees.generate(x,z,server,seed,chunk, chunkBlocksTOP, treesVectors)
							}

							

							
						}
						//birchforest
						else if(warunek >= 43 && warunek < 53){
							for(let k = 0; k < 256; k++){
								chunk.setBiome(new Vec3(x,k,z), 27)	
							}
							if(generatedY < riverMin){
								generateRiver(_x,_z,server,seed,chunk, chunkBlocksTOP,generatedY,i,x,z)
							}
							else if(generatedY == riverMin){
								if((((_x-1)*16+x)+((_z-1)*16+z))%16<10){
									chunk.setBlockType(new Vec3(x, i, z), 9) 
									chunk.setBlockData(new Vec3(x, i, z), 0)	
								}
								else{
									chunk.setBlockType(new Vec3(x, i, z), 30) 
									chunk.setBlockData(new Vec3(x, i, z), 0)
								}
								
							}
							else{

								if(generatedY > riverMin+7){
									for(let k = 0; k < 256; k++){
										chunk.setBiome(new Vec3(x,k,z),  28)	
									}
								}

								if(i == generatedY){
									chunk.setBlockType(new Vec3(x, i, z), 8) 
									chunk.setBlockData(new Vec3(x, i, z), 1)	
								}
								else if (i == generatedY - 1 || i == generatedY - 2){
									chunk.setBlockType(new Vec3(x, i, z), 9) 
									chunk.setBlockData(new Vec3(x, i, z), 0)	
								}
								else if (i == generatedY - 3 || i == generatedY - 4){
									if(seed+x+z+_x+_z%2==0){
										chunk.setBlockType(new Vec3(x, i, z), 9) 
										chunk.setBlockData(new Vec3(x, i, z), 0)	
									}
									else{
										chunk.setBlockType(new Vec3(x, i, z), 1) 
										chunk.setBlockData(new Vec3(x, i, z), 0)	
									}
								}
								else{
									chunk.setBlockType(new Vec3(x, i, z), 1) 
									chunk.setBlockData(new Vec3(x, i, z), 0)	
								}	
							}

							// tree birch
							const trees = require("./birch.js");

							if(i<=riverMin){
								let logggg = 0
							}
							else{
								trees.generate(x,z,server,seed,chunk, chunkBlocksTOP, treesVectors)
							}
						}
						// ############## PLAINS or Mountians
						else if(warunek >= 53 && warunek < 250){

							if(generatedY > riverMin + 3 || ( Math.abs((worldX*worldZ)*seed)%160 > 16 && Math.abs((worldX*worldZ)*seed)%160 < 158 )){
								// mountains
								for(let k = 0; k < 256; k++){
									chunk.setBiome(new Vec3(x,k,z), 3)	
								}
								

								
								if(generatedY < riverMin){
									generateRiver(_x,_z,server,seed,chunk, chunkBlocksTOP,generatedY,i,x,z)
								}
								else if(generatedY == riverMin){
									if((((_x-1)*16+x)+((_z-1)*16+z))%16<10){
										chunk.setBlockType(new Vec3(x, i, z), 9) 
										chunk.setBlockData(new Vec3(x, i, z), 0)	
									}
									else{
										chunk.setBlockType(new Vec3(x, i, z), 30) 
										chunk.setBlockData(new Vec3(x, i, z), 0)
									}
									
								}
								else{
									
									//other
									if(i == generatedY){
										if(generatedY >= riverMin + 13){
											chunk.setBlockType(new Vec3(x, i+1, z), 184) 
											chunk.setBlockData(new Vec3(x, i+1, z), (x*z/i)%5)	
											chunk.setBlockType(new Vec3(x, i, z), (x*z)%2 == 0 ? 186 : 1) 
											chunk.setBlockData(new Vec3(x, i, z), 0)
										}
										else{
											chunk.setBlockType(new Vec3(x, i, z), 1) 
											chunk.setBlockData(new Vec3(x, i, z), 0)
										}
											
									}
									else if (i == generatedY - 1 || i == generatedY - 2){
										chunk.setBlockType(new Vec3(x, i, z), 1) 
										chunk.setBlockData(new Vec3(x, i, z), 0)	
									}
									else if (i == generatedY - 3 || i == generatedY - 4){
										if(seed+x+z+_x+_z%2==0){
											chunk.setBlockType(new Vec3(x, i, z), 1) 
											chunk.setBlockData(new Vec3(x, i, z), 0)	
										}
										else{
											chunk.setBlockType(new Vec3(x, i, z), 1) 
											chunk.setBlockData(new Vec3(x, i, z), 0)	
										}
									}
									else{
										chunk.setBlockType(new Vec3(x, i, z), 1) 
										chunk.setBlockData(new Vec3(x, i, z), 0)	
									}
								
								}
							}
							else{
								//plains
								for(let k = 0; k < 256; k++){
									chunk.setBiome(new Vec3(x,k,z), 1)	
								}
								

								//Plains
								if(generatedY < riverMin){
									generateRiver(_x,_z,server,seed,chunk, chunkBlocksTOP,generatedY,i,x,z)
								}
								else if(generatedY == riverMin){
									if((((_x-1)*16+x)+((_z-1)*16+z))%16<10){
										chunk.setBlockType(new Vec3(x, i, z), 9) 
										chunk.setBlockData(new Vec3(x, i, z), 0)	
									}
									else{
										chunk.setBlockType(new Vec3(x, i, z), 30) 
										chunk.setBlockData(new Vec3(x, i, z), 0)
									}
									
								}
								else{
									if(i == generatedY){
										chunk.setBlockType(new Vec3(x, i, z), 8) 
										chunk.setBlockData(new Vec3(x, i, z), 1)	
									}
									else if (i == generatedY - 1 || i == generatedY - 2){
										chunk.setBlockType(new Vec3(x, i, z), 9) 
										chunk.setBlockData(new Vec3(x, i, z), 0)	
									}
									else if (i == generatedY - 3 || i == generatedY - 4){
										if(seed+x+z+_x+_z%2==0){
											chunk.setBlockType(new Vec3(x, i, z), 9) 
											chunk.setBlockData(new Vec3(x, i, z), 0)	
										}
										else{
											chunk.setBlockType(new Vec3(x, i, z), 1) 
											chunk.setBlockData(new Vec3(x, i, z), 0)	
										}
									}
									else{
										chunk.setBlockType(new Vec3(x, i, z), 1) 
										chunk.setBlockData(new Vec3(x, i, z), 0)	
									}	
								}
							}

							
							

							// trees

							

							

							
						}
						else{
							for(let k = 0; k < 256; k++){
								chunk.setBiome(new Vec3(x,k,z), 2)	
							}

							//DESERT

							if(generatedY < riverMin){
								generateRiver(_x,_z,server,seed,chunk, chunkBlocksTOP,generatedY,i,x,z)
							}
							else if(generatedY == riverMin){
								if((((_x-1)*16+x)+((_z-1)*16+z))%16<10){
									chunk.setBlockType(new Vec3(x, i, z), 28) 
									chunk.setBlockData(new Vec3(x, i, z), 0)	
								}
								else{
									chunk.setBlockType(new Vec3(x, i, z), 30) 
									chunk.setBlockData(new Vec3(x, i, z), 0)
								}
							}
							else{
								if(i == generatedY){
									chunk.setBlockType(new Vec3(x, i, z), 28) 
									chunk.setBlockData(new Vec3(x, i, z), 0)	
								}
								else if (i == generatedY - 1 || i == generatedY - 2){
									chunk.setBlockType(new Vec3(x, i, z), 71) 
									chunk.setBlockData(new Vec3(x, i, z), 0)	
								}
								else if (i == generatedY - 3 || i == generatedY - 4){
									if(seed+x+z+_x+_z%2==0){
										chunk.setBlockType(new Vec3(x, i, z), 71) 
										chunk.setBlockData(new Vec3(x, i, z), 0)	
									}
									else{
										chunk.setBlockType(new Vec3(x, i, z), 1) 
										chunk.setBlockData(new Vec3(x, i, z), 0)	
									}
								}
								else{
									chunk.setBlockType(new Vec3(x, i, z), 1) 
									chunk.setBlockData(new Vec3(x, i, z), 0)	
								}
								
							}

							const cactus = require("./cactus.js");

							if(i<=riverMin){
								let d = 0
							}
							else{
								if(((x/z)+x-(x+z))%16==1){
									cactus.generate(x,z,server,seed,chunk, chunkBlocksTOP, treesVectors)
								}	
							}
							

								

							

						}
					}
					
						//console.log(caveProbability, "jd")
						if(caveProbability > 0.5){
							chunk.setBlockType(new Vec3(x, i, z), 0) 
							chunk.setBlockData(new Vec3(x, i, z), 0)
						}

				}

				for(let yyyy=0; yyyy<256; yyyy++)
				{
					chunk.setSkyLight(new Vec3(x,yyyy,z), 15) //was 15
					
				}
			
			
			}
		}
	}
	const dataBlocks = []
	
	for(let x = 0; x<16; x++)
	{
		for(let y = 0; y < riverMin; y++)
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

	function generateRiver(_x,_z,server,seed,chunk, chunkBlocksTOP, generatedY, i,x,z){
		for(let k = 0; k < 256; k++){
			chunk.setBiome(new Vec3(x,k,z),  7)	
		}
		if(generatedY == riverMin-1){
			chunk.setBlockType(new Vec3(x, i, z),28) 
			chunk.setBlockData(new Vec3(x, i, z), 0)	
		}
		else{
			let ffw = Math.abs(((x+z)+(_x+_z))/y)
			if(ffw%30<=20){
				chunk.setBlockType(new Vec3(x, i, z), 30) 
				chunk.setBlockData(new Vec3(x, i, z), 0)	
			}
			else{
				chunk.setBlockType(new Vec3(x, i, z), 9) 
				chunk.setBlockData(new Vec3(x, i, z), 0)
			}
		}
	}

	

	

	
	// granite wall

	/*for(let i = 0; i < 16; i++){
		chunk.setBlockType(new Vec3(Math.abs(i-1), chunkBlocksTOP[Math.abs((i-1) * 16 + (0))]+1,0), 1) 
		chunk.setBlockData(new Vec3(Math.abs(i-1), chunkBlocksTOP[Math.abs((i-1) * 16 + (0))]+1,0), 1) 
	}*/


	//
	// VILLAGER
	//


	/*for(let i = 0; i < 5; i++){
		for(let j = 0; j < 5; j++){
		
		}
	}*/
}