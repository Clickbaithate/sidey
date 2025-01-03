import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Airplane from '../public/components/Airplane';
import Bullet from '../public/components/Bullet';
import Ground from '../public/components/Ground';
import Cloud from '../public/components/Cloud';
import Upgrade from './utils/spawnUpgrade';
import Zombie from './utils/SpawnZombie';
import CheckCollision from './utils/detectCollision';

function App() {
  const mountRef = useRef(null);
  const airplaneRef = useRef(null);
  let [d, setD] = useState(1);
  let [v, setV] = useState(5);
  let [f, setF] = useState(100);
  let [g, setG] = useState(false);

  // Objects
  let upgrades = [];
  let zombies = [];
  let clouds = [];
  let bullets = [];

  // Upgrades
  let fireRate = 100;
  let velocity = 5;
  let damage = 1;

  // Misc
  let frames = 0;
  let zombieRate = 100;
  let isGameOver = false;

  const handleNewGame = () => {
    zombies.forEach((zombie) => {
      if (!zombie) return;
      scene.remove(zombie.model);
    });
    upgrades.forEach((upgrade) => {
      if (!upgrade) return;
      scene.remove(upgrade.model);
    });
    clouds.forEach((cloud) => {
      if (!cloud) return;
      scene.remove(cloud.mesh);
    });
    bullets.forEach((bullet) => {
      if (!bullet) return;
      scene.remove(bullet.mesh);
    });
    upgrades = [];
    zombies = [];
    clouds = [];
    bullets = [];
    fireRate = 100;
    velocity = 5;
    damage = 1;
    frames = 0;
    zombieRate = 100;
    isGameOver = !isGameOver;
    setD(1);
    setV(5);
    setF(100);
    setG(prev => !prev);
  };

  let scene = null;
  let camera = null;
  const addScene = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 50;
    camera.position.z = 125;
  };
  addScene();

  document.body.style.margin = '0';
  const loader = new THREE.TextureLoader();
  loader.load('../public/assets/background.jpg', (texture) => {
    scene.background = texture;
  });

  let renderer = null;
  const addRenderer = () => {
    if (mountRef.current) {
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      mountRef.current.appendChild(renderer.domElement);
    }
  };

  const addControls = () => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enablePan = true;
    controls.enableZoom = true;
  };

  const addLighting = () => {
    const ambientLight = new THREE.AmbientLight(0x530132, 10);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    scene.add(directionalLight);
    directionalLight.position.set(0, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = -0.0001;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
  };

  let ground = null;
  const addGround = () => {
    ground = new Ground();
    ground.mesh.position.set(0, -35, -250);
    scene.add(ground.mesh);
  };

  let airplane = null;
  const addAirplane = () => {
    airplane = new Airplane();
    airplane.mesh.position.set(0, 0, 20);
    airplane.mesh.rotation.set(0, -4.7, 0);
    airplane.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(airplane.mesh);
    airplaneRef.current = airplane;
  };

  const addCloud = () => {
    const side = Math.floor(Math.random() * 2);
    const range = side === 0 ? Math.random() * 600 - 1000 : Math.random() * 800 + 200;
    const height = Math.random() * 600 - 300;
    const cloud = new Cloud();

    cloud.mesh.rotation.set(0, 0, 0);
    cloud.mesh.scale.set(1, 1, 1);
    cloud.mesh.position.set(range, height, -1000);
    scene.add(cloud.mesh);
    clouds.push(cloud);
  };

  const handleMouseMove = (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    const newPosX = mouseX * 200;
    const newPosY = mouseY * 50;

    if (airplaneRef.current) {
      if (newPosX > -100 && newPosX < 100) {
        airplaneRef.current.mesh.position.x = newPosX;
      }

      if (newPosY > -20 && newPosY < 10) {
        airplaneRef.current.mesh.position.y = newPosY;
      }
    }
  };

  const handleShoot = () => {
    const bullet = new Bullet(damage);
    bullet.mesh.position.set(airplane.mesh.position.x, airplane.mesh.position.y, airplane.mesh.position.z);
    bullet.mesh.rotation.set(0, 0, 0);
    bullet.mesh.scale.set(0.05, 0.05, 0.2);
    scene.add(bullet.mesh);
    bullets.push(bullet);
  };

  const updateZombiePosition = () => {
    if (!zombies || zombies.length === 0) return;
    zombies.forEach((zombie, index) => {
      if (zombie != null && zombie.model.position.z > 10) {
        const action = zombie.mixer.clipAction(zombie.animations[1]);
        action.play();
        setTimeout(() => {
          scene.remove(zombie.model);
          zombies[index] = null;
          isGameOver = true;
        }, 2000);
        zombie.model.position.z = 10;
      } else {
        if (zombie != null && zombie.isAlive) zombie.model.position.z += 1.5;
        else if (zombie != null) zombie.model.position.z -= 2;
      }
      if (zombie != null) zombie.mixer.update(0.01);
    });
  };

  const updateCloudPosition = () => {
    clouds.forEach((cloud, index) => {
      if (cloud.mesh.position.z > 100) {
        scene.remove(cloud.mesh);
        clouds.splice(index, 1);
      }
      cloud.mesh.position.z += 6;
    });
  };

  const updateBulletPosition = () => {
    bullets.forEach((bullet, index) => {
      if (bullet.mesh.position.z < -700) {
        scene.remove(bullet.mesh);
        bullets.splice(index, 1);
      }
      bullet.mesh.position.z -= velocity;
    });
  };

  const updateUpgradePosition = () => {
    upgrades.forEach((upgrade, index) => {
      if (upgrade != null && upgrade.model.position.z > 10) {
        scene.remove(upgrade.model);
        upgrades[index] = null;
      }

      if (upgrade != null) upgrade.model.position.z += 2;
      if (upgrade != null) {
        upgrade.model.rotation.x += 0.05;
        upgrade.model.rotation.y += 0.05;
        upgrade.model.rotation.z += 0.05;
      }
    });
  };

  const spawnZombie = async () => {
    const zombie = new Zombie();
    await zombie.loadModel();
    zombies.push(zombie);
    scene.add(zombie.model);
    const action = zombie.mixer.clipAction(zombie.animations[0]);
    action.play();
  };

  const spawnUpgrade = async () => {
    const upgrade = new Upgrade();
    await upgrade.loadModel();
    upgrades.push(upgrade);
    scene.add(upgrade.model);
  };

  const handleZombieDeath = (zombie, index) => {
    const action = zombie.mixer.clipAction(zombie.animations[2]);
    action.play();
    zombie.isAlive = false;
    setTimeout(() => {
      scene.remove(zombie.model);
      zombies[index] = null;
    }, 750);
  };

  const handleUpgrade = (upgrade, index) => {
    if (upgrade == null) return;
    scene.remove(upgrade.model);
    upgrades[index] = null;
    if (upgrade.ability === 0) {
      if (fireRate > 10) fireRate -= 10;
      if (fireRate > 5 && fireRate <= 10) fireRate -= 1;
    } else if (upgrade.ability === 1) {
      if (velocity < 50) velocity += 5;
    } else {
      if (damage < 15) Math.min(damage += 1, 15);
    }
  };

  const handleCollision = () => {
    bullets.forEach((bullet, bulletIndex) => {
      zombies.forEach((zombie, zombieIndex) => {
        if (zombie != null && CheckCollision(bullet.mesh.children[0], zombie.getMesh())) {
          handleZombieDeath(zombie, zombieIndex);
          scene.remove(bullet.mesh);
          bullets.splice(bulletIndex, 1);
        }
      });

      upgrades.forEach((upgrade, upgradeIndex) => {
        if (upgrade != null && CheckCollision(bullet.mesh.children[0], upgrade.getMesh())) handleUpgrade(upgrade, upgradeIndex);
      });
    });
  };

  window.addEventListener('mousemove', handleMouseMove);


  useEffect(() => {
    // Initialize the scene and start the game
    addRenderer();
    addControls();
    addLighting();
    addGround();
    addAirplane();

    
    // Animation loop
    const animate = () => {
      if (isGameOver) {
        setG(true);
        return;
      }

      requestAnimationFrame(animate);
      airplane.propeller.rotation.x += 0.3;

      if (frames % 1000 === 0 && zombieRate >= 10) zombieRate -= 10;

      // Spawning
      if (frames % fireRate === 0) handleShoot();
      if (frames % 50 === 0) addCloud();
      if (frames % zombieRate === 0) spawnZombie();
      if (frames % 200 === 0) spawnUpgrade();

      // Updating
      updateBulletPosition();
      updateCloudPosition();
      updateZombiePosition();
      updateUpgradePosition();

      // Collision
      handleCollision();

      frames++;
      setD(damage);
      setV(velocity);
      setF(fireRate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [g]);

  return (
    <div className="flex">
      <div className="absolute" ref={mountRef} />
      <div className="absolute bg-[#ffe4b9] rounded-md p-6 m-12 flex flex-col items-center shadow-[-5px_8px_10px_rgba(255,170,175,255)]">
      <div className={` text-[#f5866a] ${g ? "font-bold" : ""}`}>{g ? "Game Over" : "Sidey.io"}</div>
        <div className=" text-[#4b4131]">Damage: {d}</div>
        <div className=" text-[#4b4131]">Velocity: {v}</div>
        <div className=" text-[#4b4131]">Fire Rate: {f}</div>
        <div className='bg-[#e2d5ab] text-[#f5866a] w-24 h-10 cursor-pointer flex justify-center items-center rounded-md' onClick={() => handleNewGame()} > New Game </div>
      </div>
    </div>
  );
}

export default App;
