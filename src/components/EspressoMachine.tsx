import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor, Float } from '@react-three/drei';
import * as THREE from 'three';
import Steam from './Steam';
import CoffeeStream from './CoffeeStream';

interface EspressoMachineProps {
  onClick: () => void;
  isNight?: boolean;
  isBrewing?: boolean;
  [key: string]: any;
}

export default function EspressoMachine({ onClick, isNight, isBrewing, ...props }: EspressoMachineProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  // Floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = props.position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
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
        Note: In a real app, you'd use useGLTF('/machine.glb') here.
        Using a stylized placeholder for now.
      */}
      <mesh castShadow>
        <boxGeometry args={[1, 1.2, 0.8]} />
        <meshStandardMaterial color="#3d2b1f" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.6, 0.1]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>
      <mesh position={[0, -0.2, 0.5]}>
        <boxGeometry args={[0.6, 0.1, 0.4]} />
        <meshStandardMaterial color="#2c1e1a" />
      </mesh>

      {/* Steam Effect */}
      <Steam position={[0, 0.7, 0]} count={isBrewing ? 25 : 10} />

      {/* Coffee Stream */}
      <CoffeeStream active={isBrewing} position={[0, 0, 0.3]} />

      {/* Interactive Glow */}
      {isNight && (
        <pointLight position={[0, 0.5, 0.5]} intensity={1.5} color="#d4a373" distance={2} />
      )}
      
      {/* Indicator Light */}
      <mesh position={[0.3, 0.4, 0.41]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial 
          color={isNight ? "#00ff00" : "#333"} 
          emissive={isNight ? "#00ff00" : "#000"} 
          emissiveIntensity={2} 
        />
      </mesh>
    </group>
  );
}
