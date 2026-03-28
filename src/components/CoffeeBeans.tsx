import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CoffeeBeans({ count = 40 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.005 + Math.random() / 500;
      const xFactor = -8 + Math.random() * 16;
      const yFactor = -4 + Math.random() * 12;
      const zFactor = -10 + Math.random() * 10;
      const rotationSpeed = (Math.random() - 0.5) * 2;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, rotationSpeed });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor, rotationSpeed } = particle;
      t = particle.t += speed;
      
      const x = xFactor + Math.cos(t) * 2;
      const y = yFactor + Math.sin(t * 1.5) * 2;
      const z = zFactor + Math.sin(t) * 2;
      
      dummy.position.set(x, y, z);
      dummy.rotation.set(time * rotationSpeed, time * rotationSpeed * 0.5, time * rotationSpeed * 1.2);
      dummy.scale.setScalar(0.1 + Math.sin(t) * 0.05);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <capsuleGeometry args={[0.4, 0.6, 4, 8]} />
      <meshStandardMaterial color="#3d2b1f" roughness={0.3} metalness={0.1} />
    </instancedMesh>
  );
}
