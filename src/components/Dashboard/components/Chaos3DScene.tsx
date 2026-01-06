import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

type Chaos3DSceneProps = {
  className?: string;
  userHashrateThs: number; // Entropy level
  networkDifficulty: number; // Complexity level
  interactive?: boolean;
  onBlockFound?: () => void;
  seedHash?: string;
  evolutionLevel?: number;
};

// DJB2 hash -> 32-bit seed
const hashToSeed = (text: string): number => {
  let h = 5381 >>> 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
};

// Deterministic PRNG
const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const Chaos3DScene: React.FC<Chaos3DSceneProps> = ({
  className,
  userHashrateThs,
  networkDifficulty,
  interactive = true,
  onBlockFound,
  seedHash = 'seed',
  evolutionLevel = 0,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dynamicsRef = useRef({
    baseRotation: 0.35,
    baseParticleSpeed: 0.06,
    baseRingSpeed: 0.02,
    bloomIntensity: 0.9,
    lavaFlowSpeed: 0.05,
    blobMorphSpeed: 0.03,
    colorShiftSpeed: 0.02,
    blobFloatSpeed: 0.08,
    blobMergeSpeed: 0.04,
    turbulenceIntensity: 0.15,
    heatWaveSpeed: 0.06,
  });
  const mouseRef = useRef({ x: 0, y: 0 });
  const burstCooldownRef = useRef(0);
  const lavaBlobsRef = useRef<THREE.Mesh[]>([]);
  const fractalRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b1020, 12, 28);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const composer = new EffectComposer(renderer);
    composer.setSize(width, height);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.9, 0.8, 0.1);
    composer.addPass(bloomPass);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x445566, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x88aaff, 1.2);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xff6699, 0.8, 30);
    fillLight.position.set(-6, 1.5, -4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x66ffcc, 0.7, 25);
    rimLight.position.set(0, -3, 6);
    scene.add(rimLight);

    // Seeded params
    const seed = hashToSeed(seedHash);
    const rng = mulberry32(seed);
    const evo = Math.max(0, Math.min(10, Math.floor(evolutionLevel)));

    // Create lava lamp container (glass cylinder)
    const containerGeo = new THREE.CylinderGeometry(2.5, 2.5, 4, 32, 1, true);
    const containerMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setHSL(0.1, 0.1, 0.9),
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.95,
      thickness: 0.1,
      envMapIntensity: 1.0,
      clearcoat: 1,
      clearcoatRoughness: 0.0,
      reflectivity: 0.9,
      ior: 1.5,
      side: THREE.DoubleSide,
    });
    const lavaContainer = new THREE.Mesh(containerGeo, containerMat);
    lavaContainer.position.y = 0;
    scene.add(lavaContainer);

    // Create lava blobs (multiple organic shapes with enhanced dynamics)
    const blobCount = 4 + Math.floor(evo * 0.8);
    const lavaBlobs: THREE.Mesh[] = [];

    for (let i = 0; i < blobCount; i++) {
      // Create more organic blob shapes with higher resolution
      const blobGeo = new THREE.SphereGeometry(0.2 + rng() * 0.6, 24, 18);

      // Enhanced color system with more vibrant, shifting colors
      const baseHue = (rng() * 0.2 + 0.02) % 1; // Orange to red range
      const saturation = 0.85 + rng() * 0.15;
      const lightness = 0.55 + rng() * 0.2;

      const blobMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(baseHue, saturation, lightness),
        metalness: 0.05 + rng() * 0.1,
        roughness: 0.2 + rng() * 0.2,
        transmission: 0.4 + rng() * 0.3,
        thickness: 0.3 + rng() * 0.4,
        envMapIntensity: 0.6 + rng() * 0.3,
        clearcoat: 0.7 + rng() * 0.3,
        clearcoatRoughness: 0.1 + rng() * 0.2,
        reflectivity: 0.4 + rng() * 0.3,
        ior: 1.2 + rng() * 0.3,
        side: THREE.DoubleSide,
        emissive: new THREE.Color().setHSL(baseHue, 0.3, 0.1),
        emissiveIntensity: 0.2 + rng() * 0.3,
      });
      const blob = new THREE.Mesh(blobGeo, blobMat);

      // Random initial position within container with better distribution
      const angle = (i / blobCount) * Math.PI * 2;
      const radius = 1.5 + rng() * 1.5;
      blob.position.set(
        Math.cos(angle) * radius + (rng() - 0.5) * 0.5,
        (rng() - 0.5) * 2.5,
        Math.sin(angle) * radius + (rng() - 0.5) * 0.5
      );

      // Enhanced blob properties for more dynamic behavior
      blob.userData = {
        originalPositions: blobGeo.attributes.position.array.slice(),
        morphSpeed: 0.02 + rng() * 0.04,
        floatSpeed: 0.01 + rng() * 0.02,
        rotationSpeed: 0.015 + rng() * 0.03,
        turbulenceSpeed: 0.03 + rng() * 0.05,
        colorShiftSpeed: 0.01 + rng() * 0.02,
        baseHue: baseHue,
        saturation: saturation,
        lightness: lightness,
        size: 0.2 + rng() * 0.6,
        buoyancy: 0.5 + rng() * 0.5,
        viscosity: 0.3 + rng() * 0.4,
        heatLevel: rng(),
        lastColorChange: 0,
        targetPosition: new THREE.Vector3().copy(blob.position),
        velocity: new THREE.Vector3((rng() - 0.5) * 0.02, (rng() - 0.5) * 0.01, (rng() - 0.5) * 0.02),
      };

      lavaBlobs.push(blob);
      scene.add(blob);
    }
    lavaBlobsRef.current = lavaBlobs;

    // Create fractal patterns
    const fractalGroup = new THREE.Group();
    const fractalCount = 2 + Math.floor(evo * 0.3);

    for (let i = 0; i < fractalCount; i++) {
      const fractalGeo = new THREE.IcosahedronGeometry(0.1 + rng() * 0.2, 2);
      const fractalHue = (rng() * 0.15 + 0.05 + 0.3 + i * 0.1) % 1; // Orange to red range with offset
      const fractalMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(fractalHue, 0.7, 0.5),
        transparent: true,
        opacity: 0.6,
        wireframe: true,
      });
      const fractal = new THREE.Mesh(fractalGeo, fractalMat);

      fractal.position.set((rng() - 0.5) * 6, (rng() - 0.5) * 4, (rng() - 0.5) * 6);

      fractal.userData = {
        rotationSpeed: 0.02 + rng() * 0.03,
        orbitRadius: 1 + rng() * 2,
        orbitSpeed: 0.01 + rng() * 0.02,
        scaleSpeed: 0.005 + rng() * 0.01,
      };

      fractalGroup.add(fractal);
    }
    fractalRef.current = fractalGroup;
    scene.add(fractalGroup);

    // Enhanced fluid-like particle system
    const particleCount = 2000 + evo * 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const particleHue = rng() * 0.2 + 0.02; // Orange to red range
    const colorA = new THREE.Color().setHSL(particleHue, 0.8, 0.7);
    const colorB = new THREE.Color().setHSL((particleHue + 0.1) % 1, 0.9, 0.6);
    const colorC = new THREE.Color().setHSL((particleHue + 0.05) % 1, 0.7, 0.8);

    for (let i = 0; i < particleCount; i++) {
      // Create particles in a more organic distribution
      const r = 2.8 + rng() * 2.2 + evo * 0.06;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Random velocities for fluid motion
      velocities[i * 3 + 0] = (rng() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (rng() - 0.5) * 0.015;
      velocities[i * 3 + 2] = (rng() - 0.5) * 0.02;

      // Dynamic color mixing
      const colorMix = rng();
      let mixed;
      if (colorMix < 0.5) {
        mixed = colorA.clone().lerp(colorB, colorMix * 2);
      } else {
        mixed = colorB.clone().lerp(colorC, (colorMix - 0.5) * 2);
      }

      colors[i * 3 + 0] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;

      // Variable particle sizes
      sizes[i] = 0.015 + rng() * 0.025 + evo * 0.005;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 0.025 + evo * 0.005,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Flowing neon rings
    const rings: THREE.Mesh[] = [];
    const ringCount = 7 + evo * 2;
    for (let i = 0; i < ringCount; i++) {
      const radius = 1.8 + i * (0.18 + evo * 0.003);
      const tube = 0.003 + i * 0.001 + evo * 0.0005;
      const ringGeo = new THREE.TorusGeometry(radius, tube, 8, 180);
      const ringHue = (rng() * 0.15 + 0.05 + 0.5 + i * 0.03) % 1; // Orange to red range with offset
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(ringHue, 0.7, 0.55),
        transparent: true,
        opacity: 0.9,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = (i * Math.PI) / 16;
      ring.rotation.y = (i * Math.PI) / 24;
      rings.push(ring);
      scene.add(ring);
    }

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const dyn = dynamicsRef.current;
      // Mouse influence
      const targetTiltX = mouseRef.current.y * 0.1;

      // Enhanced lava blob animation with fluid dynamics
      lavaBlobsRef.current.forEach((blob, i) => {
        const userData = blob.userData;
        const dt = 0.016; // Approximate 60fps

        // Advanced morphing with multiple wave layers for organic movement
        const positions = blob.geometry.attributes.position;
        const originalPositions = userData.originalPositions;

        for (let j = 0; j < positions.count; j++) {
          const x = originalPositions[j * 3];
          const y = originalPositions[j * 3 + 1];
          const z = originalPositions[j * 3 + 2];

          // Multiple wave layers for complex morphing
          const time1 = t * userData.morphSpeed;
          const time2 = t * userData.turbulenceSpeed;
          const time3 = t * userData.heatLevel * 0.5;

          // Primary morphing wave
          const morphFactor1 = Math.sin(time1 + i) * 0.15;
          const wave1x = Math.sin(x * 2.5 + time1) * morphFactor1;
          const wave1y = Math.cos(y * 3 + time1 * 0.8) * morphFactor1;
          const wave1z = Math.sin(z * 2.8 + time1 * 1.2) * morphFactor1;

          // Secondary turbulence wave
          const morphFactor2 = Math.sin(time2 + i * 0.7) * 0.08;
          const wave2x = Math.cos(x * 4 + time2) * morphFactor2;
          const wave2y = Math.sin(y * 3.5 + time2 * 1.3) * morphFactor2;
          const wave2z = Math.cos(z * 3.2 + time2 * 0.9) * morphFactor2;

          // Heat wave for thermal effects
          const heatFactor = Math.sin(time3 + i * 1.5) * userData.heatLevel * 0.06;
          const heatWave = Math.sin(x * 6 + y * 4 + z * 5 + time3) * heatFactor;

          // Combine all waves
          const finalX = x + wave1x + wave2x + heatWave;
          const finalY = y + wave1y + wave2y + heatWave * 0.7;
          const finalZ = z + wave1z + wave2z + heatWave * 0.5;

          positions.setXYZ(j, finalX, finalY, finalZ);
        }
        positions.needsUpdate = true;

        // Enhanced physics-based movement
        const buoyancyForce = userData.buoyancy * 0.02;
        const viscosity = userData.viscosity;

        // Update velocity with physics
        userData.velocity.y += buoyancyForce * dt;
        userData.velocity.multiplyScalar(1 - viscosity * dt);

        // Add turbulence
        const turbulenceX = Math.sin(t * userData.turbulenceSpeed + i) * 0.01;
        const turbulenceY = Math.cos(t * userData.turbulenceSpeed * 1.3 + i) * 0.008;
        const turbulenceZ = Math.sin(t * userData.turbulenceSpeed * 0.7 + i) * 0.012;

        userData.velocity.x += turbulenceX;
        userData.velocity.y += turbulenceY;
        userData.velocity.z += turbulenceZ;

        // Update position
        blob.position.add(userData.velocity.clone().multiplyScalar(dt * 60));

        // Container boundary constraints with soft collision
        const containerRadius = 2.2;
        const containerHeight = 1.8;

        if (blob.position.length() > containerRadius) {
          const direction = blob.position.clone().normalize();
          blob.position.copy(direction.multiplyScalar(containerRadius * 0.95));
          userData.velocity.multiplyScalar(-0.3); // Soft bounce
        }

        if (Math.abs(blob.position.y) > containerHeight) {
          blob.position.y = Math.sign(blob.position.y) * containerHeight * 0.95;
          userData.velocity.y *= -0.4;
        }

        // Enhanced rotation with multiple axes
        blob.rotation.x += userData.rotationSpeed * dt * 60;
        blob.rotation.y += userData.rotationSpeed * 0.8 * dt * 60;
        blob.rotation.z += userData.rotationSpeed * 0.6 * dt * 60;

        // Dynamic color shifting with temperature simulation
        const colorTime = t * userData.colorShiftSpeed;
        const temperature = userData.heatLevel + Math.sin(colorTime + i) * 0.3;

        // Color shifts based on temperature and movement
        const hueShift = temperature * 0.1;
        const currentHue = (userData.baseHue + hueShift) % 1;
        const currentSaturation = userData.saturation + Math.sin(colorTime * 2 + i) * 0.1;
        const currentLightness = userData.lightness + Math.cos(colorTime * 1.5 + i) * 0.15;

        const material = blob.material as THREE.MeshPhysicalMaterial;
        material.color.setHSL(currentHue, currentSaturation, currentLightness);

        // Update emissive color for glow effect
        material.emissive.setHSL(currentHue, 0.4, temperature * 0.2);
        material.emissiveIntensity = 0.1 + temperature * 0.4;

        // Dynamic size changes based on heat and movement
        const sizeVariation = Math.sin(t * userData.heatLevel * 2 + i) * 0.1;
        const currentSize = userData.size + sizeVariation;
        blob.scale.setScalar(currentSize);
      });

      // Animate fractals
      if (fractalRef.current) {
        fractalRef.current.children.forEach((fractal, i) => {
          const userData = fractal.userData;

          // Rotation
          fractal.rotation.x += userData.rotationSpeed;
          fractal.rotation.y += userData.rotationSpeed * 0.8;
          fractal.rotation.z += userData.rotationSpeed * 0.5;

          // Orbital motion
          const orbitX = Math.cos(t * userData.orbitSpeed + i) * userData.orbitRadius;
          const orbitZ = Math.sin(t * userData.orbitSpeed + i) * userData.orbitRadius;
          fractal.position.x = orbitX;
          fractal.position.z = orbitZ;
          fractal.position.y = Math.sin(t * userData.orbitSpeed * 1.3 + i) * 0.5;

          // Pulsing scale
          const scale = 1 + Math.sin(t * userData.scaleSpeed + i) * 0.3;
          fractal.scale.setScalar(scale);
        });
      }

      // Enhanced particle animation with fluid dynamics
      const particlePositions = particles.geometry.attributes.position.array as Float32Array;
      const particleVelocities = particles.geometry.attributes.velocity.array as Float32Array;
      const particleSizes = particles.geometry.attributes.size.array as Float32Array;

      for (let i = 0; i < particlePositions.length / 3; i++) {
        const idx = i * 3;

        // Update velocities with fluid-like behavior
        const turbulenceX = Math.sin(t * 0.5 + i * 0.1) * 0.005;
        const turbulenceY = Math.cos(t * 0.7 + i * 0.15) * 0.003;
        const turbulenceZ = Math.sin(t * 0.3 + i * 0.08) * 0.004;

        particleVelocities[idx] += turbulenceX;
        particleVelocities[idx + 1] += turbulenceY;
        particleVelocities[idx + 2] += turbulenceZ;

        // Apply viscosity
        particleVelocities[idx] *= 0.98;
        particleVelocities[idx + 1] *= 0.98;
        particleVelocities[idx + 2] *= 0.98;

        // Update positions
        particlePositions[idx] += particleVelocities[idx];
        particlePositions[idx + 1] += particleVelocities[idx + 1];
        particlePositions[idx + 2] += particleVelocities[idx + 2];

        // Boundary wrapping for continuous flow
        const radius = Math.sqrt(
          particlePositions[idx] ** 2 + particlePositions[idx + 1] ** 2 + particlePositions[idx + 2] ** 2
        );

        if (radius > 5) {
          const angle = Math.atan2(particlePositions[idx + 2], particlePositions[idx]);
          const phi = Math.acos(particlePositions[idx + 1] / radius);
          particlePositions[idx] = 2.5 * Math.sin(phi) * Math.cos(angle);
          particlePositions[idx + 1] = 2.5 * Math.cos(phi);
          particlePositions[idx + 2] = 2.5 * Math.sin(phi) * Math.sin(angle);
        }

        // Dynamic size changes
        particleSizes[i] = 0.015 + Math.sin(t * 2 + i * 0.1) * 0.01 + evo * 0.005;
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.velocity.needsUpdate = true;
      particles.geometry.attributes.size.needsUpdate = true;

      // Overall particle rotation
      particles.rotation.y = t * dyn.baseParticleSpeed;
      particles.rotation.x = Math.sin(t * 0.2) * 0.08 + targetTiltX * 0.5;

      // Animate rings
      rings.forEach((ring, i) => {
        ring.rotation.z = t * (dyn.baseRingSpeed + i * 0.005);
      });

      // Container subtle rotation
      lavaContainer.rotation.y = t * 0.01;

      controls.update();
      bloomPass.strength = dyn.bloomIntensity;
      composer.render();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onClick = () => {
      if (!interactive) return;
      // Quick pulse on click - scale lava container
      lavaContainer.scale.set(1.04, 1.04, 1.04);
      setTimeout(() => lavaContainer.scale.set(1, 1, 1), 120);
    };
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      containerGeo.dispose();
      containerMat.dispose();
      rings.forEach(ring => {
        (ring.geometry as THREE.TorusGeometry).dispose();
        (ring.material as THREE.Material).dispose();
      });
      // Dispose lava blobs
      lavaBlobsRef.current.forEach(blob => {
        blob.geometry.dispose();
        (blob.material as THREE.Material).dispose();
      });
      // Dispose fractals
      if (fractalRef.current) {
        fractalRef.current.children.forEach(fractal => {
          (fractal as THREE.Mesh).geometry.dispose();
          ((fractal as THREE.Mesh).material as THREE.Material).dispose();
        });
      }
      renderer.dispose();
      composer.dispose();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('click', onClick);
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [interactive, seedHash, evolutionLevel]);

  // React to entropy inputs: map entropy/complexity to scene dynamics and simulate art events
  useEffect(() => {
    // Entropy level
    const entropyLevel = Math.max(0, userHashrateThs);
    const entropyFactor = entropyLevel * 1000; // Scale for better response

    // Enhanced dynamics mapping with more responsive controls
    const rotationBoost = entropyLevel > 0 ? Math.min(0.8, 0.12 * Math.log10(1 + entropyFactor)) : 0;
    const particleSpeedBoost = entropyLevel > 0 ? Math.min(0.4, 0.08 * Math.log10(1 + entropyFactor)) : 0;
    const ringSpeedBoost = entropyLevel > 0 ? Math.min(0.2, 0.05 * Math.log10(1 + entropyFactor)) : 0;
    const bloomBoost = Math.min(1.5, 0.9 + (entropyLevel > 0 ? 0.2 * Math.log10(1 + entropyFactor) : 0));
    const lavaFlowBoost = entropyLevel > 0 ? Math.min(0.15, 0.03 * Math.log10(1 + entropyFactor)) : 0;
    const blobMorphBoost = entropyLevel > 0 ? Math.min(0.08, 0.015 * Math.log10(1 + entropyFactor)) : 0;
    const colorShiftBoost = entropyLevel > 0 ? Math.min(0.08, 0.015 * Math.log10(1 + entropyFactor)) : 0;
    const blobFloatBoost = entropyLevel > 0 ? Math.min(0.12, 0.02 * Math.log10(1 + entropyFactor)) : 0;
    const turbulenceBoost = entropyLevel > 0 ? Math.min(0.25, 0.04 * Math.log10(1 + entropyFactor)) : 0;
    const heatWaveBoost = entropyLevel > 0 ? Math.min(0.1, 0.02 * Math.log10(1 + entropyFactor)) : 0;

    dynamicsRef.current.baseRotation = 0.28 + rotationBoost;
    dynamicsRef.current.baseParticleSpeed = 0.05 + particleSpeedBoost;
    dynamicsRef.current.baseRingSpeed = 0.018 + ringSpeedBoost;
    dynamicsRef.current.bloomIntensity = bloomBoost;
    dynamicsRef.current.lavaFlowSpeed = 0.05 + lavaFlowBoost;
    dynamicsRef.current.blobMorphSpeed = 0.03 + blobMorphBoost;
    dynamicsRef.current.colorShiftSpeed = 0.02 + colorShiftBoost;
    dynamicsRef.current.blobFloatSpeed = 0.08 + blobFloatBoost;
    dynamicsRef.current.turbulenceIntensity = 0.15 + turbulenceBoost;
    dynamicsRef.current.heatWaveSpeed = 0.06 + heatWaveBoost;

    // Art pattern generation simulation
    let rafId = 0;
    const simulate = (lastTime: number) => {
      rafId = requestAnimationFrame(now => {
        const dt = Math.max(0, (now - lastTime) / 1000);
        // Cooldown to avoid spamming bursts
        burstCooldownRef.current = Math.max(0, burstCooldownRef.current - dt);
        if (entropyLevel > 0) {
          const lambda = dt * entropyLevel * 0.1; // Art generation rate based on entropy
          const p = 1 - Math.exp(-lambda);
          if (burstCooldownRef.current <= 0 && Math.random() < p) {
            burstCooldownRef.current = Math.min(8, 2 / entropyLevel);
            // Trigger visual burst with lava lamp colors
            if (containerRef.current) {
              const flash = document.createElement('div');
              flash.style.position = 'absolute';
              flash.style.inset = '0';
              flash.style.pointerEvents = 'none';
              flash.style.background =
                'radial-gradient(circle at 50% 50%, rgba(255, 140, 0, 0.4), rgba(255, 69, 0, 0.2), rgba(0, 0, 0, 0.0))';
              flash.style.transition = 'opacity 800ms ease-out';
              containerRef.current.appendChild(flash);
              requestAnimationFrame(() => {
                flash.style.opacity = '0';
              });
              setTimeout(() => flash.remove(), 850);
            }
            if (onBlockFound) onBlockFound();
          }
        }
        simulate(now);
      });
    };
    simulate(performance.now());
    return () => cancelAnimationFrame(rafId);
  }, [userHashrateThs, networkDifficulty, onBlockFound]);

  return (
    <div className={className}>
      <div ref={containerRef} className="relative h-full w-full overflow-hidden rounded-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-orange-500/15 via-red-500/10 to-yellow-500/5" />
      </div>
    </div>
  );
};

export default Chaos3DScene;
