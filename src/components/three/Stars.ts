import * as THREE from 'three';
import { createMeteorMaterial } from './utils/materials';

export class Stars extends THREE.Group {
  private stars: THREE.Points;
  private meteors: THREE.Group;
  private meteorPool: THREE.Mesh[] = [];
  private activeMeteors: { mesh: THREE.Mesh; velocity: THREE.Vector3; rotation: number }[] = [];
  private lastMeteorTime: number = 0;
  private meteorInterval: number = 2000; // Time between meteors in ms
  private mouseX: number = 0;
  private mouseY: number = 0;
  
  constructor() {
    super();
    this.stars = this.createStars();
    this.meteors = new THREE.Group();
    this.add(this.stars, this.meteors);
    this.initMeteorPool();
    this.addMouseListeners();
  }

  private createStars() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const color = new THREE.Color();
    
    // Reduced number of stars
    for (let i = 0; i < 1000; i++) {
      vertices.push(
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000,
        -Math.random() * 1000
      );

      color.setHSL(0.6, 0.2, 0.6 + Math.random() * 0.4);
      colors.push(color.r, color.g, color.b);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
    });
    
    return new THREE.Points(geometry, material);
  }

  private initMeteorPool() {
    const meteorGeometry = new THREE.CylinderGeometry(0, 0.3, 8, 8);
    meteorGeometry.rotateX(Math.PI / 2);
    
    for (let i = 0; i < 20; i++) {
      const meteor = new THREE.Mesh(meteorGeometry, createMeteorMaterial());
      meteor.visible = false;
      this.meteorPool.push(meteor);
      this.meteors.add(meteor);
    }
  }

  private createMeteor() {
    const now = Date.now();
    if (now - this.lastMeteorTime < this.meteorInterval) return;
    
    const inactiveMeteor = this.meteorPool.find(meteor => !meteor.visible);
    if (!inactiveMeteor) return;

    this.lastMeteorTime = now;
    inactiveMeteor.visible = true;
    
    // Random starting position on the right side
    const startX = 100 + Math.random() * 50;
    const startY = 50 + Math.random() * 100;
    inactiveMeteor.position.set(startX, startY, -50 + Math.random() * 100);
    
    // Random rotation for variety
    const rotation = -Math.PI / 4 + (Math.random() - 0.5) * 0.2;
    inactiveMeteor.rotation.z = rotation;

    // Faster velocity for more dramatic effect
    const velocity = new THREE.Vector3(
      -15 - Math.random() * 5,
      -15 - Math.random() * 5,
      0
    );

    this.activeMeteors.push({
      mesh: inactiveMeteor,
      velocity,
      rotation
    });
  }

  private addMouseListeners() {
    // Add mouse movement event listeners to capture the mouse position
    window.addEventListener('mousemove', (event) => {
      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = - (event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  public animate() {
    // Apply mouse-based parallax to the stars
    const parallaxStrength = 50;
    this.stars.rotation.y += 0.0001;
    this.stars.rotation.x = Math.sin(Date.now() * 0.00005) * 0.1;
    this.stars.position.y = Math.sin(Date.now() * 0.0001) * 1;
    
    // Adjust star position based on mouse movement
    this.stars.position.x += (this.mouseX * parallaxStrength - this.stars.position.x) * 0.1;
    this.stars.position.z += (this.mouseY * parallaxStrength - this.stars.position.z) * 0.1;

    // Create new meteors
    this.createMeteor();

    // Update active meteors
    this.activeMeteors = this.activeMeteors.filter(meteor => {
      // Update position
      meteor.mesh.position.add(meteor.velocity);
      
      // Add trail effect
      meteor.mesh.scale.x = 1 + Math.sin(Date.now() * 0.01) * 0.1;
      
      // Remove if out of view
      if (meteor.mesh.position.y < -100 || meteor.mesh.position.x < -100) {
        meteor.mesh.visible = false;
        return false;
      }
      return true;
    });
  }
}
