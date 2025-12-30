"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function LogoSphere() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing canvas elements from previous renders
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Three.js scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Controls - disable auto rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false;
    controls.autoRotate = false; // Disable auto rotation
    controls.enableRotate = false; // Disable manual rotation

    // Fix for mobile touch events - prevent controls from capturing all touch events
    controls.enabled = false; // Disable controls completely

    // Make sure the renderer's DOM element doesn't block touch events
    renderer.domElement.style.pointerEvents = 'none';

    // Lighting - Reduced intensity for deeper metallic look
    scene.add(new THREE.AmbientLight(0xffffff, 0.6)); // Further reduced ambient light

    // Main directional light - cooler, deeper tone
    const mainLight = new THREE.DirectionalLight(0x6682cc, 0.8); // Deeper blue, lower intensity
    mainLight.position.set(0, 0, 5); // Position light directly in front
    mainLight.castShadow = false;
    scene.add(mainLight);

    // Fill light - subtle
    const fillLight = new THREE.DirectionalLight(0x8491c8, 0.4); // Deeper blue, lower intensity
    fillLight.position.set(5, 5, 5);
    fillLight.castShadow = false;
    scene.add(fillLight);

    // Bottom light - reduced further
    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.2);
    bottomLight.position.set(0, -5, 2);
    bottomLight.castShadow = false;
    scene.add(bottomLight);

    // Central logo group - using a flat circular disc
    const logoGroup = new THREE.Group();

    // Load Atorix logo texture
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('/atorix-logo.png');
    logoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Create a canvas to modify the texture
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Wait for the texture to load, then resize and enhance
    logoTexture.onload = function() {
      const img = logoTexture.image;
      canvas.width = img.width;
      canvas.height = img.height;

      // Create padding around the image (making it appear smaller within the same space)
      const paddingPercentage = 0.25; // 25% padding on each side
      const drawWidth = img.width * (1 - paddingPercentage * 2);
      const drawHeight = img.height * (1 - paddingPercentage * 2);
      const offsetX = img.width * paddingPercentage;
      const offsetY = img.height * paddingPercentage;

      // Fill with transparent background
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the resized image centered
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Get the image data to enhance colors for deeper metallic look
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Adjust colors for a richer, deeper metallic appearance
      for (let i = 0; i < data.length; i += 4) {
        // Skip fully transparent pixels
        if (data[i + 3] > 0) {
          // Deepen colors overall
          data[i] = Math.max(Math.min(data[i] * 0.8, 255), 0);     // Reduce red more
          data[i + 1] = Math.max(Math.min(data[i + 1] * 0.8, 255), 0); // Reduce green more

          // Preserve blues but make them deeper/richer
          if (data[i + 2] > 128) { // For bright blue pixels
            data[i + 2] = Math.max(Math.min(data[i + 2] * 0.9, 255), 0); // Deepen bright blues
          } else if (data[i + 2] > 50) { // For medium blue pixels
            data[i + 2] = Math.max(Math.min(data[i + 2] * 0.95, 255), 0); // Slightly deepen medium blues
          }

          // Add contrast by darkening dark pixels more
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness < 100) {
            data[i] = Math.max(data[i] * 0.7, 0);
            data[i + 1] = Math.max(data[i + 1] * 0.7, 0);
            data[i + 2] = Math.max(data[i + 2] * 0.7, 0);
          }

          // Preserve alpha but slightly boost it in semi-transparent areas
          if (data[i + 3] < 200 && data[i + 3] > 30) {
            data[i + 3] = Math.min(data[i + 3] * 1.2, 255);
          }
        }
      }

      // Put the enhanced image data back
      context.putImageData(imageData, 0, 0);

      // Update the texture
      logoTexture.image = canvas;
      logoTexture.needsUpdate = true;
    };

    // Create material for logo with deeper metallic settings
    const logoMaterial = new THREE.MeshStandardMaterial({
      map: logoTexture,
      transparent: true,
      metalness: 0.85,    // Higher metalness for stronger metallic effect
      roughness: 0.15,    // Lower roughness for more reflection but not too shiny
      side: THREE.FrontSide,
      color: 0xe8e8e8,    // Slight darkening tint
      emissive: 0x000000, // No emission
      emissiveIntensity: 0,
    });

    // Create a circular disc for the logo
    const logoDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.2, 64),
      logoMaterial
    );
    logoDisc.receiveShadow = false;
    logoDisc.castShadow = false;
    logoDisc.renderOrder = 10;

    // Position it slightly in front
    logoDisc.position.z = 0.1;

    // Always face the camera (front-facing)
    logoDisc.rotation.set(0, 0, 0);
    logoGroup.add(logoDisc);

    // Add a darker backplate for better contrast
    const backplateGeometry = new THREE.CircleGeometry(1.22, 64);
    const backplateMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    const backplate = new THREE.Mesh(backplateGeometry, backplateMaterial);
    backplate.position.z = -0.01;
    backplate.renderOrder = 9;
    logoGroup.add(backplate);

    // Add logo group to scene
    scene.add(logoGroup);

    // Create a separate layer for the rings
    const ringsLayer = new THREE.Group();
    scene.add(ringsLayer);

    // --- RINGS ---
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a88ff,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x2b4d99,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.85
    });

    // Rings group (will be rotated)
    const ringsGroup = new THREE.Group();

    // First ring (horizontal)
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2, 0.10, 18, 100),
      ringMaterial
    );
    ring1.rotation.x = Math.PI / 2;
    ring1.castShadow = false;
    ringsGroup.add(ring1);

    // Second ring (oblique/tilted)
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2, 0.10, 18, 100),
      ringMaterial
    );
    ring2.rotation.x = Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    ring2.castShadow = false;
    ringsGroup.add(ring2);

    // Third ring (vertical)
    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(2, 0.10, 18, 100),
      ringMaterial
    );
    ring3.rotation.y = Math.PI / 2;
    ring3.castShadow = false;
    ringsGroup.add(ring3);

    ringsLayer.add(ringsGroup);

    // Enhanced Decorative Particles System with Circular Texture

    // Create circular particle texture
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      const size = 64;
      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext('2d');

      // Draw a radial gradient from white center to transparent edges
      const gradient = context.createRadialGradient(
        size / 2, size / 2, 0,
        size / 2, size / 2, size / 2
      );

      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createCircleTexture();

    // Create multiple particle groups with different characteristics
    const createEnhancedParticles = () => {
      const particlesGroup = new THREE.Group();

      // Main particles - larger, bright blue
      const mainSparkGeom = new THREE.BufferGeometry();
      const n1 = 35;
      const r1 = 2.5;
      let mainPositions = [];
      let mainSizes = [];
      let mainColors = [];

      for (let i = 0; i < n1; i++) {
        // More clustered distribution for main particles
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = r1 * (0.9 + Math.random() * 0.2); // Slight variance in radius

        mainPositions.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        );

        // Varied sizes for more realism
        mainSizes.push(0.08 + Math.random() * 0.08);

        // Blue hues with slight variation
        mainColors.push(
          0.2 + Math.random() * 0.2,
          0.5 + Math.random() * 0.3,
          0.8 + Math.random() * 0.2,
          0.6 + Math.random() * 0.4
        );
      }

      mainSparkGeom.setAttribute('position', new THREE.Float32BufferAttribute(mainPositions, 3));
      mainSparkGeom.setAttribute('size', new THREE.Float32BufferAttribute(mainSizes, 1));
      mainSparkGeom.setAttribute('color', new THREE.Float32BufferAttribute(mainColors, 4));

      const mainSparkMaterial = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        map: particleTexture // Add circular texture
      });

      const mainSparkles = new THREE.Points(mainSparkGeom, mainSparkMaterial);
      particlesGroup.add(mainSparkles);

      // Secondary particles - smaller, subtle, wider spread
      const secondarySparkGeom = new THREE.BufferGeometry();
      const n2 = 60;
      const r2 = 3.0;
      let secondaryPositions = [];
      let secondarySizes = [];
      let secondaryColors = [];

      for (let i = 0; i < n2; i++) {
        // Wider, more random distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = r2 * (0.8 + Math.random() * 0.4); // More variance in radius

        secondaryPositions.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        );

        // Smaller sizes for background effect
        secondarySizes.push(0.03 + Math.random() * 0.05);

        // Varied colors - some blue, some white, some subtle purples
        const colorType = Math.random();
        if (colorType < 0.6) {
          // Blue tints
          secondaryColors.push(
            0.2 + Math.random() * 0.2,
            0.4 + Math.random() * 0.3,
            0.7 + Math.random() * 0.3,
            0.3 + Math.random() * 0.3
          );
        } else if (colorType < 0.9) {
          // White/silver tints
          const brightness = 0.6 + Math.random() * 0.4;
          secondaryColors.push(
            brightness,
            brightness,
            brightness,
            0.2 + Math.random() * 0.4
          );
        } else {
          // Subtle purple tints
          secondaryColors.push(
            0.4 + Math.random() * 0.2,
            0.2 + Math.random() * 0.2,
            0.7 + Math.random() * 0.3,
            0.2 + Math.random() * 0.3
          );
        }
      }

      secondarySparkGeom.setAttribute('position', new THREE.Float32BufferAttribute(secondaryPositions, 3));
      secondarySparkGeom.setAttribute('size', new THREE.Float32BufferAttribute(secondarySizes, 1));
      secondarySparkGeom.setAttribute('color', new THREE.Float32BufferAttribute(secondaryColors, 4));

      const secondarySparkMaterial = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        map: particleTexture // Add circular texture
      });

      const secondarySparkles = new THREE.Points(secondarySparkGeom, secondarySparkMaterial);
      particlesGroup.add(secondarySparkles);

      // Dust layer - very small, ambient particles
      const dustGeom = new THREE.BufferGeometry();
      const n3 = 100;
      const r3 = 3.5;
      let dustPositions = [];
      let dustSizes = [];
      let dustColors = [];

      for (let i = 0; i < n3; i++) {
        // Very wide distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = r3 * (0.7 + Math.random() * 0.6); // Even more variance

        dustPositions.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        );

        // Very small sizes for dust effect
        dustSizes.push(0.01 + Math.random() * 0.02);

        // Faint, desaturated colors
        const alpha = 0.1 + Math.random() * 0.2; // Very faint
        if (Math.random() < 0.5) {
          // Blue dust
          dustColors.push(
            0.3 + Math.random() * 0.2,
            0.4 + Math.random() * 0.2,
            0.6 + Math.random() * 0.3,
            alpha
          );
        } else {
          // White/silver dust
          const brightness = 0.5 + Math.random() * 0.4;
          dustColors.push(
            brightness,
            brightness,
            brightness,
            alpha
          );
        }
      }

      dustGeom.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
      dustGeom.setAttribute('size', new THREE.Float32BufferAttribute(dustSizes, 1));
      dustGeom.setAttribute('color', new THREE.Float32BufferAttribute(dustColors, 4));

      const dustMaterial = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        map: particleTexture // Add circular texture
      });

      const dust = new THREE.Points(dustGeom, dustMaterial);
      particlesGroup.add(dust);

      return {
        group: particlesGroup,
        mainSparkles,
        secondarySparkles,
        dust
      };
    };

    const particles = createEnhancedParticles();
    ringsLayer.add(particles.group);

    // ANIMATION LOOP
    const animate = () => {
      requestAnimationFrame(animate);

      // Update controls
      controls.update();

      // Rotate rings
      ringsGroup.rotation.y += 0.006;
      ringsGroup.rotation.x += 0.003;

      // Rotate particle groups at different speeds
      particles.group.rotation.y += 0.003;

      // Animate individual particle groups
      particles.mainSparkles.rotation.y += 0.001;
      particles.mainSparkles.rotation.x -= 0.0005;

      particles.secondarySparkles.rotation.y -= 0.002;
      particles.secondarySparkles.rotation.z += 0.001;

      particles.dust.rotation.y += 0.0004;
      particles.dust.rotation.x -= 0.0002;

      // Pulse the particles subtly
      const time = Date.now() * 0.001;
      particles.mainSparkles.material.size = 0.12 + Math.sin(time * 0.8) * 0.03;
      particles.secondarySparkles.material.size = 0.06 + Math.sin(time * 1.2) * 0.015;

      // Subtle floating animation for logo
      logoGroup.position.y = Math.sin(time) * 0.05;

      // Always make the logo face the camera
      logoDisc.lookAt(camera.position);

      renderer.render(scene, camera);
    };
    animate();

    // RESIZE HANDLING
    const handleResize = () => {
      if (!containerRef.current) return;

      // Get the container's dimensions
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // Update camera
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(width, height);

      // Scale the logo and elements based on screen size
      const isMobile = width < 600;
      const isTablet = width >= 600 && width < 1024;

      // Adjust the position and scale of elements based on screen size
      if (isMobile) {
        logoDisc.scale.set(0.8, 0.8, 0.8);
        backplate.scale.set(0.8, 0.8, 0.8);
        ringsGroup.scale.set(0.8, 0.8, 0.8);
        particles.group.scale.set(0.8, 0.8, 0.8);
        camera.position.z = 6; // Move camera back a bit for mobile
      } else if (isTablet) {
        logoDisc.scale.set(0.9, 0.9, 0.9);
        backplate.scale.set(0.9, 0.9, 0.9);
        ringsGroup.scale.set(0.9, 0.9, 0.9);
        particles.group.scale.set(0.9, 0.9, 0.9);
        camera.position.z = 5.5;
      } else {
        logoDisc.scale.set(1, 1, 1);
        backplate.scale.set(1, 1, 1);
        ringsGroup.scale.set(1, 1, 1);
        particles.group.scale.set(1, 1, 1);
        camera.position.z = 5;
      }
    };

    // Initial resize
    handleResize();

    window.addEventListener("resize", handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.traverse((o) => {
        if (o.isMesh || o.isPoints) {
          if (o.geometry) o.geometry.dispose();
          if (o.material) {
            if (o.material.map) o.material.map.dispose();
            o.material.dispose();
          }
        }
      });
      particleTexture.dispose();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none" // Allow touch events to pass through to elements below
      }}
    />
  );
}
