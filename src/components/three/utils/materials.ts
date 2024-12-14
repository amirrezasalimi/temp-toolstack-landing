import * as THREE from 'three';

export function createMeteorMaterial() {
  return new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0x6699ff,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  });
}