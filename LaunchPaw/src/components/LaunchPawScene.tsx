import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

const PawLogo = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime) * 0.1;
  });

  // Create a paw shape using multiple spheres
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={meshRef} scale={0.5}>
        {/* Main pad */}
        <mesh position={[0, 0, 0] as [number, number, number]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="#9333ea" // Purple color
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Toe beans */}
        {[
          [-0.7, 0.7, 0],   // Top left
          [0.7, 0.7, 0],    // Top right
          [-0.7, -0.7, 0],  // Bottom left
          [0.7, -0.7, 0],   // Bottom right
        ].map((position, index) => (
          <mesh key={index} position={position as [number, number, number]}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial
              color="#ec4899" // Pink color
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

const LaunchPawScene = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-20">
      <Canvas camera={{ position: [0, 0, 5] }} gl={{ antialias: true }}>
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
        <PawLogo />
      </Canvas>
    </div>
  );
};

export default LaunchPawScene;