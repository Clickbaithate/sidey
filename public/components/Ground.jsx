import * as THREE from 'three';

const Colors = {
  asphalt: 0x302f34,
  mark: 0xb2b4c7,
  side: 0x575761,
  curb: 0x4a4b52,
};

class Ground {
  constructor() {
    this.mesh = new THREE.Object3D();
  
  // Asphalt
  var geomGround = new THREE.BoxGeometry(200, 1, 1000);
  var matGround = new THREE.MeshPhongMaterial({color:Colors.asphalt});
  var ground = new THREE.Mesh(geomGround, matGround);
  ground.receiveShadow = true;
  this.mesh.add(ground);

  // Markings in the middle
  for (let i = 0; i < 12; i++) {
    var geomMarking = new THREE.BoxGeometry(10, 1.5, 50);
    var matMarking = new THREE.MeshPhongMaterial({color:Colors.mark});
    var marking = new THREE.Mesh(geomMarking, matMarking);
    marking.position.z = -450 + i * 80;
    marking.receiveShadow = true;
    this.mesh.add(marking);
  }

  // Sidewalk
  var geomSide = new THREE.BoxGeometry(40, 3, 1000);
  var matSide = new THREE.MeshPhongMaterial({color:Colors.side});
  var side = new THREE.Mesh(geomSide, matSide);
  var side2 = new THREE.Mesh(geomSide, matSide);
  side.receiveShadow = true;
  side2.receiveShadow = true;
  side.position.x = -125;
  side2.position.x = 125;
  this.mesh.add(side, side2);

  // Curb
  var geomCurb = new THREE.BoxGeometry(10, 8, 1000);
  var matCurb = new THREE.MeshPhongMaterial({color:Colors.curb});
  var curb = new THREE.Mesh(geomCurb, matCurb);
  var curb2 = new THREE.Mesh(geomCurb, matCurb);
  curb.receiveShadow = true;
  curb2.receiveShadow = true;
  curb.position.x = -100;
  curb2.position.x = 100;
  this.mesh.add(curb, curb2);

  // Crosswalk
  for (let i = 0; i < 10; i++) {
    var geomCross = new THREE.BoxGeometry(10, 1.5, 50);
    var matCross = new THREE.MeshPhongMaterial({color:Colors.mark});
    var cross = new THREE.Mesh(geomCross, matCross);
    cross.receiveShadow = true;
    cross.position.z = 269.5;
    cross.position.x = -80 + i * 20;
    this.mesh.add(cross);
  }

  }
}

export default Ground;
