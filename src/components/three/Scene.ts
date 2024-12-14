import * as THREE from 'three';
import { createCamera } from './utils/camera';
import { createLights } from './utils/lights';
import { createRenderer } from './utils/renderer';

export class Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  private targetCameraX: number = 0;
  private targetCameraY: number = 0;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.camera = createCamera();
    this.renderer = createRenderer(container);
    
    createLights(this.scene);
  }

  public handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public add(...objects: THREE.Object3D[]) {
    this.scene.add(...objects);
  }

  public render() {
    // Smooth parallax camera movement
    this.targetCameraX = Math.sin(Date.now() * 0.0001) * 1.5;
    this.targetCameraY = Math.cos(Date.now() * 0.0001) * 0.5;
    
    // Lerp current position to target
    this.camera.position.x += (this.targetCameraX - this.camera.position.x) * 0.02;
    this.camera.position.y += (this.targetCameraY - this.camera.position.y) * 0.02;
    this.camera.position.z = 15;
    this.camera.lookAt(0, 0, 0);
    
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    this.renderer.dispose();
  }

  public get threeScene() {
    return this.scene;
  }
}