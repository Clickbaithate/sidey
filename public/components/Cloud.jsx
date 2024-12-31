import * as THREE from 'three';

const Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xf5986e,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
  yellow: 0xFFBF00
};

class Cloud {
  constructor() {
    this.mesh = new THREE.Object3D();
	
    // create a cube geometry;
    // this shape will be duplicated to create the cloud
    var geom = new THREE.BoxGeometry(20,20,20);
    
    // create a material; a simple white material will do the trick
    var mat = new THREE.MeshPhongMaterial({
      color:Colors.white,  
    });
    
    // duplicate the geometry a random number of times
    var nBlocs = 10+Math.floor(Math.random()*10);
    for (var i=0; i<nBlocs; i++ ){
      
      // create the mesh by cloning the geometry
      var m = new THREE.Mesh(geom, mat); 
      
      // set the position and the rotation of each cube randomly
      m.position.x = i*15;
      m.position.y = Math.random()*75;
      m.position.z = Math.random()*10;
      m.rotation.z = Math.random()*Math.PI*2;
      m.rotation.y = Math.random()*Math.PI*2;
      
      // set the size of the cube randomly
      var s = 1 + Math.random()*2;
      m.scale.set(s,s,s);
      
      // allow each cube to cast and to receive shadows
      m.castShadow = true;
      m.receiveShadow = true;
      
      // add the cube to the container we first created
      this.mesh.add(m);
  }
  }
}

export default Cloud;