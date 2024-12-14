import * as THREE from 'three';

export function createLights(scene: THREE.Scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  
  const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
  pointLight2.position.set(-5, -5, 5);
  
  scene.add(ambientLight, pointLight, pointLight2);
}