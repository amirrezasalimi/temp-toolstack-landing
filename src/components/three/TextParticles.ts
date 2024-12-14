import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

export class TextParticles {
  private particles: THREE.Points;
  private scene: THREE.Scene;
  private gradientTexture: THREE.Texture;
  private originalPositions: Float32Array;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.gradientTexture = this.createGradientTexture();
  }

  public async init() {
    const font = await this.loadFont();
    const textGeometry = this.createTextGeometry(font);
    this.createParticles(textGeometry);
  }

  private loadFont(): Promise<THREE.Font> {
    return new Promise((resolve, reject) => {
      const loader = new FontLoader();
      loader.load(
        "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
        resolve,
        undefined,
        reject
      );
    });
  }

  private createTextGeometry(font: THREE.Face) {
    const textGeometry = new TextGeometry("TOOLSTACK", {
      font,
      size: 4,
      height: 0.3,
    });
    textGeometry.center();
    return textGeometry;
  }

  private createGradientTexture(): THREE.Texture {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, "#6A0DAD"); // Purple
    gradient.addColorStop(1, "#0000FF"); // Blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private createParticles(geometry: TextGeometry) {
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)).build();
    const particleCount = 6000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    this.originalPositions = new Float32Array(particleCount * 3);

    const tempPosition = new THREE.Vector3();

    for (let i = 0; i < particleCount; i++) {
      sampler.sample(tempPosition);

      positions[i * 3] = tempPosition.x;
      positions[i * 3 + 1] = tempPosition.y;
      positions[i * 3 + 2] = tempPosition.z;

      this.originalPositions[i * 3] = tempPosition.x;
      this.originalPositions[i * 3 + 1] = tempPosition.y;
      this.originalPositions[i * 3 + 2] = tempPosition.z;

      const color = new THREE.Color();
      color.setHSL((tempPosition.x + 5) / 10, 0.7, 0.5); // Adjust gradient logic

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      map: this.gradientTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(particleGeometry, material);
    this.scene.add(this.particles);
  }
}
