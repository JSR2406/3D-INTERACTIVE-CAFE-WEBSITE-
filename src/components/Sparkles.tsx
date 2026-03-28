import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Sparkles({ count = 20, position = [0, 0, 0], color = "#ffffff" }: { count?: number, position?: [number, number, number], color?: string }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const speed = 0.01 + Math.random() / 100;
      const x = (Math.random() - 0.5) * 1.5;
      const y = (Math.random() - 0.5) * 0.8;
      const z = (Math.random() - 0.5) * 0.6;
      temp.push({ t, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    particles.forEach((particle, i) => {
      let { t, speed, x, y, z } = particle;
      t = particle.t += speed;
      
      const s = Math.abs(Math.sin(t)) * 0.05;
      
      dummy.position.set(x, y + Math.sin(t) * 0.1, z);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} position={position}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.8} />
    </instancedMesh>
  );
}
