import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { Object3D, Vector3, Mesh } from "three";
import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  SpotLight,
  useDepthBuffer,
  OrbitControls,
} from "@react-three/drei";

function App() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowDimensions({ width: width, height: height });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Canvas
      style={{ width: windowDimensions.width, height: windowDimensions.height }}
      camera={{ position: [-2, 4, 9], fov: 50, near: 1, far: 20 }}
    >
      <color attach="background" args={["#202020"]} />
      <ambientLight intensity={0.5} />
      <Scene />
    </Canvas>
  );
}
function Scene() {
  const cube = useRef<Mesh>(null!);

  useFrame(() => {
    cube.current.rotateX(0.01);
    cube.current.rotateY(0.01);
  });
  return (
    <>
      <MovingSpot color="#0c8cbf" position={[3, 5, 2]} />
      <MovingSpot color="#b00c3f" position={[1, 5, 0]} />
      <mesh position={[0, 0.8, 0]} ref={cube}>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhysicalMaterial
          transmission={1}
          roughness={0}
          thickness={0.1}
          color={"#87CEEB"}
          specularIntensity={0.4}
          ior={2.2}
          clearcoat={0.5}
        />
      </mesh>
      <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[50, 50]} />
        <meshPhongMaterial color={"grey"} />
      </mesh>
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[50, 50]} />
        <meshPhongMaterial />
      </mesh>
    </>
  );
}

function MovingSpot({ ...props }) {
  const light = useRef<Object3D>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const target = light.current.children[0];
    target.position.setX(Math.sin(time) * 2);
  });
  return (
    <object3D ref={light}>
      <SpotLight
        castShadow
        penumbra={1}
        distance={6}
        angle={0.35}
        attenuation={7}
        anglePower={4}
        intensity={2}
        {...props}
      />
    </object3D>
  );
}

export default App;
