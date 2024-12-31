import * as THREE from 'three';

const Colors = {
  yellow: 0xfdfa04,
  red: 0xFD0504,
  purple: 0x5404FD
};

class Bullet {
  constructor(damage) {
    this.mesh = new THREE.Object3D();
  
  // Create the cabin
  var geomBullet = new THREE.BoxGeometry(60,50,50,1,1,1);
  var matBullet = new THREE.MeshPhongMaterial({color: damage === 1 ? Colors.yellow : (damage === 5 ? Colors.red : Colors.purple) });
  var bullet = new THREE.Mesh(geomBullet, matBullet);
  bullet.castShadow = true;
  bullet.receiveShadow = true;
  this.mesh.add(bullet);
  }
}

export default Bullet;
