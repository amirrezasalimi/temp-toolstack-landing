import * as THREE from 'three';

export interface Particle {
  mesh: THREE.Mesh;
  originalPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
}