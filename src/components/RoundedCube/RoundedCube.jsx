// components/RoundedCube.jsx
import React, { useRef } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { RoundedBox, OrbitControls } from "@react-three/drei";

const RoundedCube = () => {
  const cubeRef = useRef();

  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.025;
      cubeRef.current.rotation.y += 0.035;
      cubeRef.current.rotation.z += 0.02;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <RoundedBox
        ref={cubeRef}
        args={[3.3, 3.3, 3.3]}
        radius={0.4}
        smoothness={6}
      >
        <meshStandardMaterial
          attach="material"
          color="#a8c0ff"
          emissive="#3f2b96"
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.4}
        />
      </RoundedBox>
      <OrbitControls enableZoom={false} enableRotate={false} />
    </>
  );
};

export default RoundedCube;
