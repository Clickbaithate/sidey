import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box } from './objects/Box';

function App() {
  
  const mountRef = useRef(null); // Ref to attach the Three.js renderer to

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true; 
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Cube
    const cube = new Box({ width: 1, height: 1, depth: 1, color: '#01ffee', position: { x: 0, y: 0, z: 9.5 } });
    cube.castShadow = true;
    scene.add(cube);

    // Adding platform
    const ground = new Box({ width: 5, height: 0.5, depth: 20, color: '#0000ff', position: { x: 0, y: -1, z: 0 } });
    ground.receiveShadow = true; 
    scene.add(ground);

    // Adding light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.z = 3;
    light.position.y = 5;
    light.castShadow = true;
    scene.add(light);

    window.addEventListener('keydown', (event) => {
      switch(event.code) {
        case 'KeyA':
          cube.moveLeft();
          break;
        case 'KeyD':
          cube.moveRight();
          break;
      }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.update(ground);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div>
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
}

export default App;
