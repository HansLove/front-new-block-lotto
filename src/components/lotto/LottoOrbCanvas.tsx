import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import type { OrbParams } from './orbMath';

const DEFAULT_CORE = 0x0d9488;
const DEFAULT_RIM = 0x2dd4bf;
const DEFAULT_SHELL = 0x5eead4;

function parseAccentColor(hex: string | undefined): { core: number; rim: number; shell: number } {
  if (!hex || !/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    return { core: DEFAULT_CORE, rim: DEFAULT_RIM, shell: DEFAULT_SHELL };
  }
  const core = new THREE.Color(hex).getHex();
  const rim = new THREE.Color(hex).clone().lerp(new THREE.Color(0xffffff), 0.25).getHex();
  const shell = new THREE.Color(hex).clone().lerp(new THREE.Color(0xffffff), 0.45).getHex();
  return { core, rim, shell };
}

export interface LottoOrbCanvasProps {
  /** Size in px (width and height). */
  size?: number;
  params: OrbParams;
  isMining?: boolean;
  isPlusUltra?: boolean;
  /** When true, component is in viewport (IntersectionObserver). */
  visible?: boolean;
  /** Optional hex color for orb (core/rim/shells); derived from ticketId when set. */
  accentColor?: string;
}

export function LottoOrbCanvas({
  size = 140,
  params,
  isMining = false,
  isPlusUltra = false,
  visible = true,
  accentColor,
}: LottoOrbCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  const paramsRef = useRef(params);
  const isMiningRef = useRef(isMining);
  const isPlusUltraRef = useRef(isPlusUltra);
  paramsRef.current = params;
  isMiningRef.current = isMining;
  isPlusUltraRef.current = isPlusUltra;

  const colors = useMemo(() => parseAccentColor(accentColor), [accentColor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || useFallback) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let meshCore: THREE.Mesh;
    let meshRim: THREE.Mesh;
    const meshShells: THREE.Mesh[] = [];
    let meshHalo: THREE.Mesh | null = null;
    let frameId = 0;
    const startTime = Date.now();

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(25, 1, 0.1, 100);
      camera.position.set(0, 0, 4.5);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0x404060, 0.8);
      scene.add(ambient);
      const dir = new THREE.DirectionalLight(0xffffff, 0.9);
      dir.position.set(2, 2, 3);
      scene.add(dir);

      const coreGeom = new THREE.SphereGeometry(0.5, 32, 24);
      const coreMat = new THREE.MeshStandardMaterial({
        color: colors.core,
        emissive: colors.core,
        emissiveIntensity: 0.35,
        metalness: params.metalness,
        roughness: params.roughness,
      });
      meshCore = new THREE.Mesh(coreGeom, coreMat);
      scene.add(meshCore);

      const rimGeom = new THREE.SphereGeometry(0.52, 32, 24);
      const rimMat = new THREE.MeshBasicMaterial({
        color: colors.rim,
        transparent: true,
        opacity: 0.4,
        side: THREE.BackSide,
      });
      meshRim = new THREE.Mesh(rimGeom, rimMat);
      scene.add(meshRim);

      for (let i = 0; i < 5; i++) {
        const r = 0.54 + i * 0.04;
        const shellGeom = new THREE.SphereGeometry(r, 24, 16);
        const shellMat = new THREE.MeshBasicMaterial({
          color: colors.shell,
          transparent: true,
          opacity: 0.12,
          side: THREE.BackSide,
          depthWrite: false,
        });
        const shell = new THREE.Mesh(shellGeom, shellMat);
        meshShells.push(shell);
        scene.add(shell);
      }

      const haloGeom = new THREE.TorusGeometry(0.58, 0.02, 16, 48);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xfb923c,
        transparent: true,
        opacity: 0.8,
      });
      meshHalo = new THREE.Mesh(haloGeom, haloMat);
      meshHalo.rotation.x = Math.PI / 2;
      scene.add(meshHalo);
    } catch {
      setUseFallback(true);
      return;
    }

    function animate() {
      if (!container || !container.isConnected) return;
      frameId = requestAnimationFrame(animate);
      if (!visible) return;

      const p = paramsRef.current;
      const mining = isMiningRef.current;
      const plusUltra = isPlusUltraRef.current;
      const t = (Date.now() - startTime) / 1000;
      const pulse = 0.5 + 0.5 * Math.sin(t * (p.pulseSpeed * 1.2));
      const intensity = p.intensity;
      const baseEmissive = 0.35 + intensity * 0.35;
      const pulseEmissive = 0.2 * pulse + (mining ? pulse * 0.2 : 0) + (plusUltra ? pulse * 0.35 : 0);
      const coreMat = meshCore.material as THREE.MeshStandardMaterial;
      coreMat.emissiveIntensity = Math.min(1, baseEmissive + pulseEmissive);
      coreMat.metalness = p.metalness;
      coreMat.roughness = p.roughness;

      const rimOpacity = 0.35 + intensity * 0.2 + 0.25 * pulse + (plusUltra ? pulse * 0.2 : 0);
      (meshRim.material as THREE.MeshBasicMaterial).opacity = Math.min(0.7, rimOpacity);

      const shellsToShow = p.shells;
      meshShells.forEach((m, i) => {
        m.visible = i < shellsToShow;
        const shellPulse = 0.5 + 0.5 * Math.sin(t * 0.8 + i * 0.5);
        (m.material as THREE.MeshBasicMaterial).opacity = 0.08 + intensity * 0.08 + shellPulse * 0.06;
      });

      if (meshHalo) {
        meshHalo.visible = plusUltra;
        (meshHalo.material as THREE.MeshBasicMaterial).opacity = 0.5 + pulse * 0.4;
        meshHalo.rotation.z += 0.03;
      }

      const wobbleAmount = p.wobble * Math.sin(t * 1.2);
      meshCore.scale.setScalar(1 + wobbleAmount);
      meshRim.scale.setScalar(1 + wobbleAmount);
      const rotSpeed = plusUltra ? 0.022 : mining ? 0.014 : 0.01;
      meshCore.rotation.y += rotSpeed;
      meshRim.rotation.y = meshCore.rotation.y;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      meshShells.forEach(m => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      if (meshHalo) {
        meshHalo.geometry.dispose();
        (meshHalo.material as THREE.Material).dispose();
      }
      meshCore.geometry.dispose();
      (meshCore.material as THREE.Material).dispose();
      meshRim.geometry.dispose();
      (meshRim.material as THREE.Material).dispose();
    };
  }, [size, useFallback, visible, isMining, isPlusUltra, accentColor, colors]);

  const fallbackStroke = accentColor && /^#[0-9A-Fa-f]{6}$/.test(accentColor) ? accentColor : '#14b8a6';
  const fallbackFill = accentColor && /^#[0-9A-Fa-f]{6}$/.test(accentColor) ? accentColor : '#0d9488';

  if (useFallback) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox="-1 -1 2 2"
          className="overflow-visible animate-pulse"
          style={{ animationDuration: '2.5s' }}
        >
          {[1, 2, 3, 4, 5].slice(0, params.shells).map((_, i) => {
            const r = 0.4 + (i + 1) * 0.12;
            const opacity = 0.08 + params.intensity * 0.08;
            return (
              <ellipse
                key={i}
                cx="0"
                cy="0"
                rx={r}
                ry={r * 0.9}
                fill="none"
                stroke={fallbackStroke}
                strokeWidth={0.04}
                opacity={opacity}
              />
            );
          })}
          <ellipse
            cx="0"
            cy="0"
            rx="0.45"
            ry="0.4"
            fill={fallbackFill}
            opacity={0.3 + params.intensity * 0.4}
          />
          {isPlusUltra && (
            <ellipse
              cx="0"
              cy="0"
              rx="0.55"
              ry="0.5"
              fill="none"
              stroke="#f97316"
              strokeWidth={0.03}
              opacity={0.6}
            />
          )}
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center overflow-hidden rounded-full bg-transparent"
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    />
  );
}
