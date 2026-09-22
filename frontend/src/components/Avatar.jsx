import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function AvatarHead() {
  const headRef = useRef();

  useFrame((state) => {
    if (!headRef.current) return;

    // Natural floating movement
    headRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.5) * 0.03;

    // Small head movement
    headRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group ref={headRef}>

      {/* Head */}

      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[1, 32, 32]} />

        <meshStandardMaterial
          color="#f1c7a5"
        />
      </mesh>


      {/* Left Eye */}

      <mesh position={[-0.35, 0.65, 0.85]}>
        <sphereGeometry args={[0.12, 16, 16]} />

        <meshStandardMaterial color="black" />
      </mesh>


      {/* Right Eye */}

      <mesh position={[0.35, 0.65, 0.85]}>
        <sphereGeometry args={[0.12, 16, 16]} />

        <meshStandardMaterial color="black" />
      </mesh>


      {/* Nose */}

      <mesh position={[0, 0.35, 0.95]}>
        <coneGeometry args={[0.12, 0.3, 16]} />

        <meshStandardMaterial
          color="#e5ae8c"
        />
      </mesh>


      {/* Mouth */}

      <mesh position={[0, 0.05, 0.9]}>

        <boxGeometry
          args={[0.35, 0.08, 0.05]}
        />

        <meshStandardMaterial
          color="#8b1e3f"
        />

      </mesh>


      {/* Neck */}

      <mesh position={[0, -0.6, 0]}>

        <cylinderGeometry
          args={[0.4, 0.45, 0.6, 32]}
        />

        <meshStandardMaterial
          color="#f1c7a5"
        />

      </mesh>


      {/* Body */}

      <mesh position={[0, -1.25, 0]}>

        <boxGeometry
          args={[1.5, 1.2, 0.7]}
        />

        <meshStandardMaterial
          color="#2563eb"
        />

      </mesh>

    </group>
  );
}


function Avatar() {

  return (

    <div
      style={{
        width: "100%",
        height: "500px",
        background: "#111827",
        borderRadius: "20px",
        overflow: "hidden"
      }}
    >

      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 45
        }}
      >

        <ambientLight intensity={2} />

        <directionalLight
          position={[2, 3, 5]}
          intensity={3}
        />

        <AvatarHead />

        <OrbitControls
          enableZoom={false}
        />

      </Canvas>

    </div>

  );
}

export default Avatar;