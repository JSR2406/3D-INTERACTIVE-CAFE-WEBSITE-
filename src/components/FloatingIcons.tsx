import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import { Coffee, Cake, Cookie, CupSoda, Croissant, IceCream, Utensils, Milk, Sandwich } from 'lucide-react';
import * as THREE from 'three';

interface FloatingIconProps {
  icon: React.ReactNode;
  position: [number, number, number];
  color: string;
  speed?: number;
  rotationSpeed?: number;
}

function FloatingIcon({ icon, position, color, speed = 1, rotationSpeed = 1 }: FloatingIconProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * speed) * 0.5;
    groupRef.current.rotation.y = t * 0.2 * rotationSpeed;
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Html transform distanceFactor={5} position={[0, 0, 0]} occlude="blending">
          <div 
            className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transition-all hover:scale-110"
            style={{ color }}
          >
            {icon}
          </div>
        </Html>
      </Float>
      {/* Subtle glow behind the icon */}
      <pointLight intensity={0.5} distance={2} color={color} />
    </group>
  );
}

export default function FloatingIcons() {
  const icons = useMemo(() => [
    { icon: <Coffee size={32} />, position: [-6, 3, -5] as [number, number, number], color: '#d4a373', speed: 0.8, rotationSpeed: 1.2 },
    { icon: <Cake size={32} />, position: [6, 4, -4] as [number, number, number], color: '#faedcd', speed: 1.1, rotationSpeed: 0.8 },
    { icon: <Cookie size={32} />, position: [-4, 5, -8] as [number, number, number], color: '#ccd5ae', speed: 0.9, rotationSpeed: 1.5 },
    { icon: <CupSoda size={32} />, position: [5, 2, -6] as [number, number, number], color: '#e9edc9', speed: 1.3, rotationSpeed: 0.7 },
    { icon: <Croissant size={32} />, position: [-7, 1, -3] as [number, number, number], color: '#fefae0', speed: 0.7, rotationSpeed: 1.1 },
    { icon: <IceCream size={32} />, position: [7, 6, -7] as [number, number, number], color: '#d4a373', speed: 1.2, rotationSpeed: 0.9 },
    { icon: <Utensils size={32} />, position: [-3, 6, -4] as [number, number, number], color: '#e6d5c3', speed: 1.0, rotationSpeed: 1.0 },
    { icon: <Milk size={32} />, position: [4, 7, -5] as [number, number, number], color: '#ffffff', speed: 0.8, rotationSpeed: 1.3 },
    { icon: <Sandwich size={32} />, position: [-5, -1, -6] as [number, number, number], color: '#d4a373', speed: 1.1, rotationSpeed: 0.7 },
  ], []);

  return (
    <group>
      {icons.map((item, index) => (
        <FloatingIcon key={index} {...item} />
      ))}
    </group>
  );
}
