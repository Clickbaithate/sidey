import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Zombie {
  constructor(health = 1) {
    this.mixer = null;
    this.model = null; // Will hold the loaded zombie model
    this.loader = new GLTFLoader();
    this.health = health;
    this.animations = [];
  }

  loadModel() {
    return new Promise((resolve, reject) => {
      this.loader.load(
        '/assets/zombie.glb',
        (gltf) => {
          this.model = gltf.scene;

          // Set initial position and scale
          this.model.position.set(Math.random() * (-90 - -20) + -20, 75, -650);
          this.model.scale.set(25, 25, 25);

          // Setup animation mixer if animations exist
          if (gltf.animations && gltf.animations.length) {
            this.mixer = new THREE.AnimationMixer(this.model);
            const action = this.mixer.clipAction(gltf.animations[0]);
            this.animations = gltf.animations;
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.play();
          }

          resolve(this);
        },
        undefined,
        (error) => {
          console.error('Error loading zombie model', error);
          reject(error);
        }
      );
    });
  }

  // In Zombie class
  getMesh() {
    if (!this.model || this.model.children.length === 0) {
      return null;
    }
    // Search recursively
    function findMesh(object) {
      if (object.isMesh) {
        return object;
      }
      for (let child of object.children) {
        const mesh = findMesh(child);
        if (mesh) return mesh;
      }
      return null;
    }
    return findMesh(this.model);
  }
  

}
