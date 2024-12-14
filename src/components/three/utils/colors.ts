import * as THREE from 'three';

export function createGradientColor(
  x: number,
  minX: number,
  width: number,
  colors: THREE.Color[]
): THREE.Color {
  const t = (x - minX) / width;
  const color = new THREE.Color();
  
  if (t <= 0.5) {
    color.lerpColors(colors[0], colors[1], t * 2);
  } else {
    color.lerpColors(colors[1], colors[2], (t - 0.5) * 2);
  }
  
  return color;
}