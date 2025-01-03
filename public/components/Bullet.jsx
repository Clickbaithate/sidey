import * as THREE from 'three';

const Colors = {
  yellow: 0xfdfa04,
  red: 0xFD0504,
  purple: 0x5404FD,
  error: 0x00ff44
};

class Bullet {
  constructor(damage) {
    this.mesh = new THREE.Object3D();
  
  // Create the cabin
  let color = Colors.yellow;
  if (damage === 1) color = Colors.yellow;
  else if (damage > 1 && damage <= 10) color = Colors.red;
  else if (damage > 10) color = Colors.purple;
  else color = Colors.error;
  var geomBullet = new THREE.BoxGeometry(60,50,50,1,1,1);
  var matBullet = new THREE.MeshPhongMaterial({color: color});
  var bullet = new THREE.Mesh(geomBullet, matBullet);
  bullet.castShadow = true;
  bullet.receiveShadow = true;
  this.mesh.add(bullet);
  }
}

export default Bullet;
