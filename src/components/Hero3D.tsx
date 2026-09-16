import React, { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Grid } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

/* ---------------- animated rig with mouse parallax ---------------- */

function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  useFrame((state, delta) => {
    target.current.x = state.pointer.y * 0.14;
    target.current.y = state.pointer.x * 0.2;
    if (ref.current) {
      ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, target.current.x, 2.4, delta);
      ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, target.current.y, 2.4, delta);
    }
  });
  return <group ref={ref}>{children}</group>;
}

/* ---------------- translucent spheres ---------------- */

const SPHERES: { pos: [number, number, number]; scale: number; color: string; speed: number; opacity: number }[] = [
  { pos: [-4.6, 1.4, -2], scale: 1.5, color: "#2563eb", speed: 1.4, opacity: 0.28 },
  { pos: [4.4, 2, -3], scale: 1.9, color: "#7c3aed", speed: 1.1, opacity: 0.24 },
  { pos: [3.2, -1.4, -1], scale: 0.9, color: "#06b6d4", speed: 1.8, opacity: 0.32 },
  { pos: [-3, -1.8, -1.5], scale: 0.7, color: "#d946ef", speed: 2, opacity: 0.26 },
  { pos: [0.8, 2.6, -4], scale: 1.1, color: "#3b82f6", speed: 1.2, opacity: 0.2 },
  { pos: [-5.4, -0.6, -4], scale: 0.8, color: "#8b5cf6", speed: 1.6, opacity: 0.22 },
];

function Spheres() {
  return (
    <>
      {SPHERES.map((s, i) => (
        <Float key={i} speed={s.speed} rotationIntensity={0.4} floatIntensity={1.6}>
          <mesh position={s.pos} scale={s.scale}>
            <sphereGeometry args={[1, 48, 48]} />
            <meshStandardMaterial color={s.color} transparent opacity={s.opacity} roughness={0.15} metalness={0.25} emissive={s.color} emissiveIntensity={0.14} />
          </mesh>
          <mesh position={s.pos} scale={s.scale * 1.015}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={s.color} wireframe transparent opacity={0.09} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/* ---------------- rotating geometric shapes ---------------- */

function Shapes() {
  const torus = useRef<THREE.Mesh>(null);
  const knot = useRef<THREE.Mesh>(null);
  const ico = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (torus.current) {
      torus.current.rotation.x = t * 0.16;
      torus.current.rotation.y = t * 0.1;
    }
    if (knot.current) {
      knot.current.rotation.x += delta * 0.25;
      knot.current.rotation.y += delta * 0.32;
    }
    if (ico.current) {
      ico.current.rotation.y -= delta * 0.18;
      ico.current.rotation.z += delta * 0.1;
    }
  });
  return (
    <>
      <mesh ref={torus} position={[0, 0.3, -5]}>
        <torusGeometry args={[3.4, 0.02, 12, 120]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 0.3, -5]} rotation={[0.8, 0.4, 0]} scale={0.78}>
        <torusGeometry args={[3.4, 0.012, 12, 120]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
      </mesh>
      <Float speed={1.5} floatIntensity={1.2}>
        <mesh ref={knot} position={[-2.2, 1.1, -2.6]} scale={0.5}>
          <torusKnotGeometry args={[1, 0.24, 140, 18]} />
          <meshStandardMaterial color="#d946ef" wireframe transparent opacity={0.5} />
        </mesh>
      </Float>
      <Float speed={1.3} floatIntensity={1.4}>
        <mesh ref={ico} position={[4.9, -0.4, -2.2]} scale={0.75}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#06b6d4" wireframe transparent opacity={0.5} />
        </mesh>
      </Float>
    </>
  );
}

/* ---------------- growth line chart in 3D ---------------- */

function GrowthLine() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const x = -5 + (i / 40) * 10;
      const y = -2.2 + Math.pow(i / 40, 1.8) * 2.4 + Math.sin(i * 0.5) * 0.14;
      pts.push(new THREE.Vector3(x, y, -3.4));
    }
    return pts;
  }, []);
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const mat = useRef<THREE.LineBasicMaterial>(null);
  useFrame((state) => {
    if (mat.current) mat.current.opacity = 0.45 + Math.sin(state.clock.elapsedTime * 1.4) * 0.15;
  });
  return (
    <primitive object={new THREE.Line(geom, new THREE.LineBasicMaterial({ color: "#22d3ee", transparent: true, opacity: 0.5 }))} />
  );
}

/* ---------------- scene ---------------- */

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[-6, 4, 2]} intensity={60} color="#06b6d4" />
      <pointLight position={[6, 3, 1]} intensity={60} color="#7c3aed" />
      <pointLight position={[0, -4, 3]} intensity={30} color="#2563eb" />
      <Rig>
        <Spheres />
        <Shapes />
        <GrowthLine />
        <Sparkles count={110} scale={[16, 9, 6]} size={2.2} speed={0.32} color="#67e8f9" opacity={0.55} />
        <Sparkles count={70} scale={[14, 8, 5]} size={3.4} speed={0.22} color="#c084fc" opacity={0.4} />
        <Grid
          position={[0, -3.1, 0]}
          args={[40, 40]}
          cellSize={0.7}
          cellThickness={0.6}
          cellColor="#1b2452"
          sectionSize={3.5}
          sectionThickness={1}
          sectionColor="#2d3a8f"
          fadeDistance={22}
          fadeStrength={2.4}
          infiniteGrid
        />
      </Rig>
    </>
  );
}

/* ---------------- static fallback ---------------- */

export function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-electric/25 blur-[130px]" />
      <div className="absolute -right-24 top-40 h-[28rem] w-[28rem] rounded-full bg-violetx/25 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyanx/20 blur-[120px]" />
      <div className="bg-grid absolute inset-0" />
    </div>
  );
}

class GLBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <HeroFallback /> : this.props.children; }
}

export default function Hero3D() {
  const reduce = useReducedMotion();
  const [webgl] = useState(() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch { return false; }
  });
  if (reduce || !webgl) return <HeroFallback />;
  return (
    <div className="absolute inset-0" aria-hidden>
      <GLBoundary>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.3, 9], fov: 46 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </GLBoundary>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,transparent_30%,rgba(7,11,26,0.72)_100%)]" />
    </div>
  );
}
