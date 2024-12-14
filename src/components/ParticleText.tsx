import { useEffect, useRef, useState } from 'react';
import { Scene } from './three/Scene';
import { Stars } from './three/Stars';
import { TextParticles } from './three/TextParticles';

const ParticleText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<Scene>();
  const starsRef = useRef<Stars>();
  const textParticlesRef = useRef<TextParticles>();
  // page loaded
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !loaded) return;

    console.log("loaded", loaded);
    
    // Initialize scene
    const scene = new Scene(containerRef.current);
    sceneRef.current = scene;

    // Add stars
    const stars = new Stars();
    scene.add(stars);
    starsRef.current = stars;

    // Initialize text particles
    const textParticles = new TextParticles(scene.threeScene);
    textParticlesRef.current = textParticles;
    textParticles.init().catch(console.error);

    // Mouse movement handler with global coordinates
    const onMouseMove = (event: MouseEvent) => {
      // Get mouse position relative to the window
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Normalize mouse position to the full screen dimensions
      mousePosition.current.x = (mouseX / window.innerWidth) * 2 - 1; // range [-1, 1] based on full screen width
      mousePosition.current.y = -(mouseY / window.innerHeight) * 2 + 1; // range [-1, 1] based on full screen height
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (starsRef.current) {
        starsRef.current.animate();
      }

      if (textParticlesRef.current) {
        // textParticlesRef.current.update(mousePosition.current.x, mousePosition.current.y);
      }

      scene.render();
    };

    // Handle window resize
    const handleResize = () => scene.handleResize();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      scene.dispose();
    };
  }, [loaded]);

  return <div ref={containerRef} className="fixed inset-0" />;
};

export default ParticleText;
