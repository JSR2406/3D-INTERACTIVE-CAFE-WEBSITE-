import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';
import Sparkles from './Sparkles';

interface PastryCaseProps {
  onClick: () => void;
  isNight?: boolean;
  [key: string]: any;
}

export default function PastryCase({ onClick, isNight, ...props }: PastryCaseProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  // Floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = props.position[1] + Math.sin(state.clock.elapsedTime * 1.2 + 1) * 0.08;
    }
  });

  return (
    <group
      ref={meshRef}
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 
        Note: In a real app, you'd use useGLTF('/pastry.glb') here.
        Using a stylized placeholder for now.
      */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 1, 0.6]} />
        <meshStandardMaterial color="#e6d5c3" transparent opacity={0.4} roughness={0} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[1.5, 0.2, 0.6]} />
        <meshStandardMaterial color="#2c1e1a" />
      </mesh>
      {/* Pastry placeholders */}
      <Sparkles position={[0, 0, 0]} count={15} color="#fff" />
      <mesh position={[-0.4, 0, 0]}>
        <torusGeometry args={[0.12, 0.05, 12, 24]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0, 0.1, 0.1]}>
        <coneGeometry args={[0.15, 0.3, 16]} />
        <meshStandardMaterial color="#f06292" />
      </mesh>

      {/* Interior Glow */}
      {isNight && (
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffccaa" distance={1.5} />
      )}
    </group>
  );
}
