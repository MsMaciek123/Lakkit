const Vec3 = require("vec3")
function generate(_x,_z,server,seed,chunk, chunkBlocksTOP, treesVectors = [[0,0]]){

    let ___y = chunkBlocksTOP[Math.abs((_x-1) * 16 + (_z))]+1 // y

    if(chunk.getBlock(new Vec3(_x+1, parseInt(___y), _z)).stateId == 0 && chunk.getBlock(new Vec3(_x-1, parseInt(___y), _z)).stateId == 0 && chunk.getBlock(new Vec3(_x, parseInt(___y), _z+1)).stateId == 0 && chunk.getBlock(new Vec3(_x, parseInt(___y), _z-1)).stateId == 0)
    {
        for(let i = 0; i < 3+parseInt(Math.random()*2); i++){
            chunk.setBlockType(new Vec3(_x, parseInt(___y)+i, _z), 187) 
            chunk.setBlockData(new Vec3(_z, parseInt(___y)+i, _z), 0)
        } 
    }
    else{
        for(let i = 0; i < 3+parseInt(Math.random()); i++){
            chunk.setBlockType(new Vec3(_x, parseInt(___y)+i, _z), 187) 
            chunk.setBlockData(new Vec3(_z, parseInt(___y)+i, _z), 0)
        } 
    }
     
    

}
module.exports = { generate }