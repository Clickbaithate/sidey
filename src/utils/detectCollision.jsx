import * as THREE from 'three';

export default function CheckCollision(object1, object2, temp) {
  if (!object1.isMesh) {
    if (temp) console.log('Bullet is not mesh!:', object1);
    return false;
  }
  if (!object2.isMesh) {
    if (temp) console.log(object2);
    return false;
  }

  const box1 = new THREE.Box3().setFromObject(object1);
  const box2 = new THREE.Box3().setFromObject(object2);
  
  if (box1.intersectsBox(box2)) {
    return true;
  }
  return false;
}
