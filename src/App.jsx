import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function App() {
  
  const mountRef = useRef(null); // Ref to attach the Three.js renderer to

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true; // 1 of 4 settings to allow shadows
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Cube
    // Dimensions of cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // Colors of each face of the cube
    // These materials allow for lighting
    const material = [
      new THREE.MeshStandardMaterial({ color: 0xff0000 }),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 }),
      new THREE.MeshStandardMaterial({ color: 0x0000ff }),
      new THREE.MeshStandardMaterial({ color: 0xffff00 }),
      new THREE.MeshStandardMaterial({ color: 0xff00ff }),
      new THREE.MeshStandardMaterial({ color: 0x00ffff })
    ];
    // Creating the cube
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true; // 2 of 4, allow cube to cast shadow
    // Adding the cube
    scene.add(cube);

    // Adding platform
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.5, 10), 
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    );
    ground.position.y = -2;
    ground.receiveShadow = true; // 3 of 4, where the shadow will be casted to
    scene.add(ground);

    // Adding light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.z = 3;
    light.position.y = 5;
    light.castShadow = true; // 4 of 4, allow light to cast shadows
    scene.add(light);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.05;
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
