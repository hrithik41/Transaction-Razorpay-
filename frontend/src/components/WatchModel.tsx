"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// This is a premium 3D placeholder for your watch model. 
// It renders a beautiful glass/metal complex shape.
// To use your real watch:
// 1. Put your watch.glb in the public folder
// 2. Use const { scene } = useGLTF('/watch.glb')
// 3. Return <primitive object={scene} /> instead of this mesh
function PremiumWatchPlaceholder() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Use useFrame for continuous subtle "breathing" rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.1;
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* We use a TorusKnot to simulate a complex mechanical structure like a watch movement */}
        <mesh scale={1.5}>
          <torusKnotGeometry args={[1, 0.3, 256, 32]} />
          {/* A premium glass & metallic material */}
          <meshPhysicalMaterial 
            color="#e5e7eb"
            metalness={0.8}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.5}
            ior={1.5}
            thickness={0.5}
            envMapIntensity={2}
          />
        </mesh>
      </Float>
      {/* Soft elegant shadow underneath */}
      <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#000000" />
    </group>
  );
}

export default function WatchModel() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Tie the scale and rotation of the 3D Canvas container to the scroll progress
  useEffect(() => {
    if (!containerRef.current) return;

    const tween = gsap.to(containerRef.current, {
      scale: 1.3,
      rotation: 15,
      y: 50,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        // Because the hero is pinned for 3000px, we scrub over that entire duration
        start: "top center",
        end: "+=3000",
        scrub: 1,
      }
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative z-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} className="w-full h-full pointer-events-auto">
        <ambientLight intensity={0.5} />
        {/* Studio lighting setup for premium feel */}
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
        <spotLight position={[0, 10, 0]} intensity={1} angle={0.5} penumbra={1} />
        
        <PremiumWatchPlaceholder />
        
        {/* Environment mapping gives the metallic/glass materials their reflections */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
