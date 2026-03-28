import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CoffeeStream({ active = false, position = [0, 0, 0] }: { active?: boolean, position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (active) {
      meshRef.current.scale.y = 1;
      meshRef.current.visible = true;
      // Animate the texture or scale to simulate pouring
      const t = state.clock.getElapsedTime();
      meshRef.current.scale.x = 0.8 + Math.sin(t * 20) * 0.1;
      meshRef.current.scale.z = 0.8 + Math.sin(t * 20) * 0.1;
    } else {
      meshRef.current.visible = false;
    }
  });

  return (
    <mesh ref={meshRef} position={position} visible={false}>
      <cylinderGeometry args={[0.02, 0.015, 0.4]} />
      <meshStandardMaterial color="#4e342e" roughness={0.1} metalness={0.5} transparent opacity={0.9} />
    </mesh>
  );
}
