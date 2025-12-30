"use client";

import { useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, SoftShadows, Environment } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { MotionConfig } from "framer-motion";
import * as THREE from "three";

// Interactive 3D cube with dynamic colors and animations
function Cubes({ count = 30, mouse }) {
  const meshes = useRef([]);
  const { viewport } = useThree();

  useEffect(() => {
    // Generate random positions for cubes
    meshes.current = Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * viewport.width * 2,
        (Math.random() - 0.5) * viewport.height * 2,
        (Math.random() - 0.5) * 10, // Z depth
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: Math.random() * 0.4 + 0.1,
      color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
    }));
  }, [count, viewport]);

  useFrame((state, delta) => {
    // Animate each cube
    meshes.current.forEach((mesh, i) => {
      const ref = mesh.ref;
      if (!ref) return;

      // Rotate based on time
      ref.rotation.x += delta * 0.1 * (i % 2 ? 1 : -1);
      ref.rotation.y += delta * 0.05 * (i % 2 ? 1 : -1);

      // Make cubes react slightly to mouse position
      if (mouse.current) {
        ref.position.x += (mouse.current[0] * 0.1 - ref.position.x) * 0.01;
        ref.position.y += (mouse.current[1] * 0.1 - ref.position.y) * 0.01;
      }
    });
  });

  return (
    <>
      {meshes.current.map((props, i) => (
        <motion.mesh
          key={i}
          ref={(ref) => (props.ref = ref)}
          position={props.position}
          rotation={props.rotation}
          scale={props.scale}
          whileHover={{ scale: props.scale * 1.5 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={props.color}
            roughness={0.5}
            metalness={0.2}
            transparent
            opacity={0.7}
          />
        </motion.mesh>
      ))}
    </>
  );
}

// Floating grid component for ground
function Grid({ size = 10, divisions = 10, cell = 1 }) {
  const gridRef = useRef();

  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.position.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.2;
      gridRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.05) * 0.02;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[size, divisions, "#1a90ff", "#1a90ff"]}
      position={[0, 0, -2]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[1, 1, 1]}
    />
  );
}

// Floating particles
function Particles({ count = 300, mouse }) {
  const mesh = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  // Generate particle positions
  const dummy = new THREE.Object3D();
  const particles = useRef();

  useEffect(() => {
    // Create random positions and scales for particles
    particles.current = new Array(count).fill().map(() => ({
      position: [
        (Math.random() - 0.5) * viewport.width * 2,
        (Math.random() - 0.5) * viewport.height * 2,
        (Math.random() - 0.5) * 10,
      ],
      scale: Math.random() * 0.2 + 0.05,
      velocity: [
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
      ],
    }));
  }, [count, viewport]);

  useFrame((state, delta) => {
    if (!particles.current || !mesh.current) return;

    // Update and render each particle
    particles.current.forEach((particle, i) => {
      // Update position based on velocity
      particle.position[0] += particle.velocity[0];
      particle.position[1] += particle.velocity[1];
      particle.position[2] += particle.velocity[2];

      // Subtle mouse influence
      if (mouse.current) {
        const mouseX = mouse.current[0] / aspect;
        const mouseY = -mouse.current[1] / aspect;
        particle.position[0] += (mouseX * 0.1 - particle.position[0]) * 0.005;
        particle.position[1] += (mouseY * 0.1 - particle.position[1]) * 0.005;
      }

      // Wrap particles around when they go off screen
      const limit = 10;
      if (Math.abs(particle.position[0]) > limit)
        particle.position[0] = -particle.position[0];
      if (Math.abs(particle.position[1]) > limit)
        particle.position[1] = -particle.position[1];
      if (Math.abs(particle.position[2]) > limit)
        particle.position[2] = -particle.position[2];

      // Set the particle position and scale
      dummy.position.set(...particle.position);
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();

      // Apply to the instanced mesh
      mesh.current.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshBasicMaterial color="#1a90ff" transparent opacity={0.2} />
    </instancedMesh>
  );
}

// Main scene component
function Scene({ mouse }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 10);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 10, 5]} intensity={1} castShadow />
      <Particles mouse={mouse} />
      <Cubes mouse={mouse} />
      <Grid />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
}

// Main export component
export default function ThreeJSBackground({ className = "" }) {
  const mouse = useRef([0, 0]);

  const handleMouseMove = (e) => {
    if (e.target) {
      const rect = e.target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.current = [x, y];
    }
  };

  return (
    <div className={`absolute inset-0 ${className}`} onMouseMove={handleMouseMove}>
      <MotionConfig transition={{ duration: 0.5, type: "spring" }}>
        <Canvas shadows gl={{ antialias: true, alpha: true }}>
          <Scene mouse={mouse} />
          <SoftShadows size={10} samples={16} />
          <Environment preset="city" />
        </Canvas>
      </MotionConfig>
    </div>
  );
}
