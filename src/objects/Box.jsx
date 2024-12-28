import * as THREE from 'three';

export class Box extends THREE.Mesh {

  constructor({ 
    width, 
    height, 
    depth, 
    color = '#00ff00',
    velocity = {
      x: 0, 
      y: 0, 
      z: 0
    },
    position = {
      x: 0, 
      y: 0, 
      z: 0
    }
  }) {
    super(
      new THREE.BoxGeometry(width, height, depth), 
      new THREE.MeshStandardMaterial({ color })
    );
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.position.set(position.x, position.y, position.z);
    this.top = this.position.y + this.height / 2;
    this.bottom = this.position.y - this.height / 2;

    this.velocity = velocity;
  }

  update(ground) {
    this.top = this.position.y + this.height / 2;
    this.bottom = this.position.y - this.height / 2;

    this.position.x += this.velocity.x;
    this.applyGravity(ground);
  }

  moveLeft() {
    if (!(this.position.x + this.velocity.x <= -2)) {
      this.position.x -= 0.1;
    }
  }

  moveRight() {
    if (!(this.position.x + this.velocity.x >= 2)) {
      this.position.x += 0.1;
    }
  }

  applyGravity(ground) {
    this.velocity.y -= 0.0025;

    if (this.bottom + this.velocity.y <= ground.top) {
      this.velocity.y *= 0.8;
      this.velocity.y = -this.velocity.y;
    }
    else {
      this.position.y += this.velocity.y;
    }
  }

}