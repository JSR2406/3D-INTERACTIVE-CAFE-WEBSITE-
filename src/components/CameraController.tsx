import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';

interface CameraControllerProps {
  targetView: 'shop' | 'espresso' | 'pastry';
}

export default function CameraController({ targetView }: CameraControllerProps) {
  const { camera } = useThree();
  const breathingRef = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    // Subtle breathing motion
    const t = state.clock.getElapsedTime();
    breathingRef.current.x = Math.sin(t * 0.5) * 0.05;
    breathingRef.current.y = Math.cos(t * 0.3) * 0.05;

    camera.position.x += (breathingRef.current.x - 0) * 0.01;
    camera.position.y += (breathingRef.current.y - 0) * 0.01;
  });

  useEffect(() => {
    if (targetView === 'espresso') {
      // Zoom into Espresso Machine
      gsap.to(camera.position, {
        x: -2,
        y: 1.5,
        z: 3,
        duration: 1.5,
        ease: 'power3.inOut',
      });
      gsap.to(camera.rotation, {
        x: -0.2,
        y: -0.5,
        z: 0,
        duration: 1.5,
        ease: 'power3.inOut',
      });
    } else if (targetView === 'pastry') {
      // Zoom into Pastry Case
      gsap.to(camera.position, {
        x: 2,
        y: 1.5,
        z: 3,
        duration: 1.5,
        ease: 'power3.inOut',
      });
      gsap.to(camera.rotation, {
        x: -0.2,
        y: 0.5,
        z: 0,
        duration: 1.5,
        ease: 'power3.inOut',
      });
    } else {
      // Default Shop View
      gsap.to(camera.position, {
        x: 0,
        y: 2,
        z: 7,
        duration: 1.5,
        ease: 'power3.inOut',
      });
      gsap.to(camera.rotation, {
        x: -0.2,
        y: 0,
        z: 0,
        duration: 1.5,
        ease: 'power3.inOut',
      });
    }
  }, [targetView, camera]);

  return null;
}
