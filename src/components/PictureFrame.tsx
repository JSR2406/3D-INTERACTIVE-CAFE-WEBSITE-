import React from 'react';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

interface PictureFrameProps {
  url: string;
  title: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export default function PictureFrame({ url, title, position, rotation = [0, 0, 0], scale = [1, 1, 1] }: PictureFrameProps) {
  const texture = useTexture(url);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Frame - Ultra thin and elegant */}
      <mesh castShadow>
        <boxGeometry args={[1.05, 1.05, 0.02]} />
        <meshStandardMaterial color="#1a1412" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Picture */}
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Micro Label */}
      <Html position={[0, -0.6, 0.02]} center transform distanceFactor={3}>
        <div className="flex flex-col items-center opacity-60">
          <div className="w-px h-4 bg-white/20 mb-2" />
          <span className="text-[8px] uppercase tracking-[0.2em] font-sans text-white/80 whitespace-nowrap">
            {title}
          </span>
        </div>
      </Html>
      
      {/* Subtle light for the picture */}
      <pointLight intensity={0.1} distance={2} position={[0, 0, 0.5]} color="#d4a373" />
    </group>
  );
}
