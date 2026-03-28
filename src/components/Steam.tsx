import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SteamProps {
  count?: number;
  position?: [number, number, number];
}

export default function Steam({ count = 15, position = [0, 0, 0] }: SteamProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -2 + Math.random() * 4;
      const yFactor = -2 + Math.random() * 4;
      const zFactor = -2 + Math.random() * 4;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      particle.mx += (state.mouse.x * 1000 - particle.mx) * 0.01;
      particle.my += (state.mouse.y * 1000 - particle.my) * 0.01;
      
      dummy.position.set(
        (particle.mx / 1000) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 1000) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 1000) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      
      // Simpler upward motion for steam
      const time = state.clock.getElapsedTime();
      const index = i;
      const x = Math.sin(time + index) * 0.1;
      const y = ((time + index * 0.5) % 2) * 0.5;
      const z = Math.cos(time + index) * 0.1;
      
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(Math.max(0, 1 - y / 2) * 0.2);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} position={position}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.2} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
      />
    </instancedMesh>
  );
}
