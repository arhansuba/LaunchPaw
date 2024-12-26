import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

const AvalancheLogo = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={1}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#E84142" metalness={0.8} roughness={0.2} />
      </mesh>
    </Float>
  );
};

const AvalancheScene = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-20">
      <Canvas camera={{ position: [0, 0, 5] }} gl={{ antialias: true }}>
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <AvalancheLogo />
      </Canvas>
    </div>
  );
};

export default AvalancheScene;
