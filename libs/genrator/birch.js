const Vec3 = require("vec3")
function generate(_x,_z,server,seed,chunk, chunkBlocksTOP, treesVectors = [[0,0]]){
    let ManyTrees = 1//Math.abs(seed*_x*_z)%40//(seed%(_x+_z))
	//console.log("jdd",ManyTrees)

	if(Math.abs((_z*seed)%(_z/_x)+(seed+_x)) % 164 > 15 && Math.abs((_z*seed)%(_z/_x)+(seed+_x)) % 164 < 47){
		let chunkTreesVectors = []
		for(let i = 0; i < ManyTrees; i++){
			let ___x = _x
			let ___z = _z
			if(___x <= 3){
				___x = 4
			}
			else if(___x >= 13){
				___x = 12
			}
			if(___z <= 3){
				___z = 4
			}
			else if(___z >= 13){
				___z = 12
			}
	
			let ___y = chunkBlocksTOP[Math.abs((___x-1) * 16 + (___z))]+1 // y
	
			if(chunk.getBlock(new Vec3(___x,___y,___z)).stateId == "26"){
				break;
			}
			else if(chunk.getBlock(new Vec3(___x,___y-1,___z)).stateId == "0"){
				break;
			}
			else if(chunk.getBlock(new Vec3(___x,___y-1,___z)).stateId == "28"){
				break;
			}
			else if(chunk.getBlock(new Vec3(___x,___y,___z)).stateId == "28"){
				break;
			}

			let canContinue = true

			for(let j = 0; j < treesVectors.length; j++){
				if(treesVectors[j].x == ___x && treesVectors[j].z == ___z){
					canContinue = false
					break;
				}
				else if(treesVectors[j].x == ___x+1 && treesVectors[j].z == ___z){
					canContinue = false
					break;
				}
				else if(treesVectors[j].x == ___x-1 && treesVectors[j].z == ___z){
					canContinue = false
					break;
				}
				else if(treesVectors[j].x == ___x && treesVectors[j].z == ___z+1){
					canContinue = false
					break;
				}
				else if(treesVectors[j].x == ___x && treesVectors[j].z == ___z-1){
					canContinue = false
					break;
				}

				else if(treesVectors[j].x == ___x+1 && treesVectors[j].z == ___z+1){
					canContinue = false
					break;
				}
				else if(treesVectors[j].x == ___x-1 && treesVectors[j].z == ___z-1){
					canContinue = false
					break;
				}
				else if(treesVectors[j].x == ___x-1 && treesVectors[j].z == ___z+1){
					canContinue = false
					break;
				}
				else if(treesVectors[j].x == ___x+1 && treesVectors[j].z == ___z-1){
					canContinue = false
					break;
				}
			}

			if(canContinue){

				treesVectors.push({x:___x,y:___y,z:___z})
					//birch
					for(let j = 0; j < 5+((_x+_z)%2); j++){
						chunk.setBlockType(new Vec3(___x, parseInt(___y)+j, ___z), 37) 
						chunk.setBlockData(new Vec3(___x, parseInt(___y)+j, ___z), 1)	
					}
			
					for(let y____ = 0; y____ < 2; y____++){
						for(let x____ = 0; x____ < 5; x____++){
							for(let z____ = 0; z____ < 5; z____++){
								chunk.setBlockType(new Vec3(___x-2+x____, parseInt(___y)+5+y____, ___z-2+z____), 61) 
								chunk.setBlockData(new Vec3(___x-2+x____, parseInt(___y)+5+y____, ___z-2+z____), 1)	
							}
						}
					}
					for(let y____ = 0; y____ < 1; y____++){
						for(let x____ = 0; x____ < 3; x____++){
							for(let z____ = 0; z____ < 3; z____++){
								chunk.setBlockType(new Vec3(___x-1+x____, parseInt(___y)+7+y____, ___z-1+z____), 61) 
								chunk.setBlockData(new Vec3(___x-1+x____, parseInt(___y)+7+y____, ___z-1+z____), 1)	
							}
						}
					}
					chunk.setBlockType(new Vec3(___x, parseInt(___y)+8, ___z), 61) 
					chunk.setBlockData(new Vec3(___x, parseInt(___y)+8, ___z), 1)	
			
					chunk.setBlockType(new Vec3(___x+1, parseInt(___y)+8, ___z), 61) 
					chunk.setBlockData(new Vec3(___x+1, parseInt(___y)+8, ___z), 1)	
			
					chunk.setBlockType(new Vec3(___x-1, parseInt(___y)+8, ___z), 61) 
					chunk.setBlockData(new Vec3(___x-1, parseInt(___y)+8, ___z), 1)	
			
					chunk.setBlockType(new Vec3(___x, parseInt(___y)+8, ___z+1), 61) 
					chunk.setBlockData(new Vec3(___x, parseInt(___y)+8, ___z+1), 1)	
			
					chunk.setBlockType(new Vec3(___x, parseInt(___y)+8, ___z-1), 61) 
					chunk.setBlockData(new Vec3(___x, parseInt(___y)+8, ___z-1), 1)	
				
	
				
			}
			
		}
	}

	
}

module.exports = { generate }