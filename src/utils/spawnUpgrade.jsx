import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Upgrade {
  constructor() {
    this.model = null; // Will hold the loaded upgrade model
    this.loader = new GLTFLoader();
    this.ability = Math.floor(Math.random() * 3);
  }

  loadModel() {
    return new Promise((resolve, reject) => {
      this.loader.load(
        '/assets/barrel.glb', // Replace with your model path
        (gltf) => {
          this.model = gltf.scene;

          // Set initial position, scale, and rotation
          this.model.position.set(Math.random() * 50, -15, -700);
          this.model.scale.set(15, 15, 15);
          this.model.rotation.x = Math.PI * 1.5;
          this.model.rotation.y = Math.PI * 1.5;
          this.model.rotation.z = Math.PI * 1.5;

          // Resolve the promise with the upgrade instance
          resolve(this);
        },
        undefined,
        (error) => {
          console.error('Error loading upgrade model', error);
          reject(error);
        }
      );
    });
  }

  // Get the mesh for the upgrade model
  getMesh() {
    if (!this.model || this.model.children.length === 0) {
      return null;
    }

    // Search recursively for the mesh
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
