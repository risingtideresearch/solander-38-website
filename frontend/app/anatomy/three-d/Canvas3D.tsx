"use client";
import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Environment, GizmoHelper, OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Canvas } from "@react-three/fiber";
import { Vector3, Box3, Group, Camera, Plane } from "three";
import * as THREE from "three";
import { Model3D } from "./Model3D";
import ScalingLines3D from "./ScalingLines3D";
import RaycastHandler from "./RaycastHandler";
import { contextualLayers, MaterialIndex, Model } from "./util";
import HoverDisplay from "../HoverDisplay";
import { ControlSettings } from "../Anatomy";
import { GizmoViewcube } from "./GizmoViewcube";
import { Component } from "@/sanity/sanity.types";

export type ClippingValues = { value: [number, number]; axis: "x" | "y" | "z" };

type Canvas3DProps = {
  clippingPlanes?: Array<Plane>;
  clippingValues?: ClippingValues;
  filteredLayers: Array<string>;
  settings?: ControlSettings;
  boundingBox?: Box3 | null;
  height?: string | number;
  materials?: MaterialIndex;
  memoModels?: Array<Model>;
  handleLoaded?: () => void;
  loaded?: boolean;
  componentParts?: Array<Component>;
  // use for article models
  interaction?: "all" | "limited" | "none";
};

const CAMERA_INITIAL_POSITION = [0, 0, 0] as const;
const CAMERA_FOV = 30;
const LIGHT_POSITIONS: Vector3[] = [
  new Vector3(2, 4, -4),
  // new Vector3(-14, -2, 5),
];

export function Canvas3D({
  clippingPlanes,
  clippingValues,
  settings = {},
  boundingBox,
  filteredLayers,
  interaction = "all",
  height = "100vh",
  materials = {},
  memoModels = [],
  handleLoaded,
  componentParts,
  loaded,
}: Canvas3DProps) {
  const groupRef = useRef<Group>(null);
  const cameraRef = useRef<Camera>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [centered, setCentered] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<Model | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const gizmoPosition = useRef(window?.innerWidth < 800 ? [60, 150] : [110, 90])

  const tempBox = useRef(new Box3());
  const tempCenter = useRef(new Vector3());
  const tempSize = useRef(new Vector3());
  const tempDirection = useRef(new Vector3());
  const tempNewPos = useRef(new Vector3());
  const CAMERA_DIRECTION =
    interaction == "none"
      ? new Vector3(0.1, 0.1, 0.5)
      : new Vector3(0.5, 0.25, 0.625);

  const handleModelLoad = useCallback((url: string) => {
    setModelsLoaded((prev) => {
      const newSet = new Set(prev);
      newSet.add(url);
      return newSet;
    });

    return () => {
      if (groupRef.current) {
        groupRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry?.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material?.dispose();
            }
          }
        });
      }

      groupRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (groupRef.current) {
        groupRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry?.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material?.dispose();
            }
          }
        });
      }
    };
  }, []);

  const centerCamera = useCallback(() => {
    if (!groupRef.current || !controlsRef.current || !cameraRef.current) {
      return;
    }

    tempBox.current.setFromObject(groupRef.current);
    const center = tempBox.current.getCenter(tempCenter.current);
    if (interaction != "all") {
      center.y -= 0.5;
    }
    const size = tempBox.current.getSize(tempSize.current);

    const camera = cameraRef.current;
    const fov = camera.fov * (Math.PI / 180);
    const aspect = camera.aspect;

    tempDirection.current.copy(CAMERA_DIRECTION).normalize();

    const boundingSphereRadius =
      Math.sqrt(size.x * size.x + size.y * size.y + size.z * size.z) / 2;

    const effectiveFov =
      aspect < 1 ? 2 * Math.atan(Math.tan(fov / 2) * aspect) : fov;

    const baseDistance = boundingSphereRadius / Math.sin(effectiveFov / 2);

    const FIT_DISTANCE_MULTIPLIER = 0.95;
    const fitDistance = baseDistance * FIT_DISTANCE_MULTIPLIER;

    const newPos = tempNewPos.current
      .copy(center)
      .add(tempDirection.current.multiplyScalar(fitDistance));

    cameraRef.current.position.copy(newPos);
    cameraRef.current.lookAt(center);
    controlsRef.current.target.copy(center);
    controlsRef.current.update();

    setCentered(true);
  }, [interaction]);

  useEffect(() => {
    try {
      if (
        modelsLoaded.size >= filteredLayers.length &&
        filteredLayers.length > 0 &&
        !centered
      ) {
        centerCamera();

        if (handleLoaded) {
          handleLoaded();
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }, [modelsLoaded.size, filteredLayers.length, centered]);

  const handleCanvasCreated = useCallback(({ camera, gl }) => {
    cameraRef.current = camera;
    gl.localClippingEnabled = true;
  }, []);

  const directionalLights = useMemo(
    () =>
      LIGHT_POSITIONS.map((pos, index) => (
        <directionalLight
          key={index}
          position={pos}
          intensity={0.2}
          color={"#ffffff"}
        />
      )),
    [],
  );

  const canvasRef = useRef(null);

  // const downloadImage = () => {
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const image = canvas.toDataURL("image/png");

  //     const link = document.createElement("a");
  //     link.href = image;
  //     link.download = "solander-38.png";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };

  return (
    <div style={{ height: height }}>
      <div
        style={{
          opacity: centered ? 1 : 0,
          transition: "opacity 500ms",
          height: height,
          cursor: "crosshair",
        }}
      >
        <Canvas
          ref={canvasRef}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          camera={{ position: CAMERA_INITIAL_POSITION, fov: CAMERA_FOV }}
          onCreated={handleCanvasCreated}
          onPointerEnter={() => setAutoRotate(false)}
          onPointerLeave={() => setAutoRotate(true)}
        >
          <Environment
            blur={100}
            backgroundRotation={[0, -Math.PI / 6, 0]}
            preset="sunset"
          />

          {interaction == "all" && (
            <RaycastHandler
              clippingPlanes={clippingPlanes}
              setHovered={(layer) => {
                setHovered(
                  layer
                    ? memoModels.find(
                        (d) => layer.name == d.filename.replace(".glb", ""),
                      ) || null
                    : null,
                );
              }}
            />
          )}

          <ambientLight intensity={0.4} />
          {directionalLights}

          <Suspense fallback={null}>
            {boundingBox && clippingValues && settings.scalingLines && (
              <>
                <ScalingLines3D
                  boundingBox={boundingBox}
                  unit={settings.units}
                  clippingValues={clippingValues}
                />

                {/* <Annotations3D
                  annotations={content.annotations}
                  setActiveAnnotation={setActiveAnnotation}
                /> */}
              </>
            )}

            <group ref={groupRef}>
              {filteredLayers.map((url: string) => (
                <Model3D
                  key={url}
                  url={url}
                  onLoad={() => handleModelLoad(url)}
                  clippingPlanes={clippingPlanes}
                  transparent={
                    (settings.transparent &&
                      (contextualLayers.includes(url) ||
                        url ==
                          "BODY__CTR BEAM__ctr beam inside surfaces.glb")) ||
                    false
                  }
                />
              ))}
            </group>
          </Suspense>
          {/* <mesh
            position={[-6, -49, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[220, 220, 100]}
          >
            <boxGeometry />
            <meshBasicMaterial
              color="rgba(31, 64, 103, 1)"
              opacity={0.8}
              transparent={true}
              side={THREE.DoubleSide}
            />
          </mesh> */}
          {/* 
          {LIGHT_POSITIONS.map((light, i) => (
            <mesh
              position={light}
              key={i}
            >
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshBasicMaterial
                color="rgb(31, 64, 103)"
                side={THREE.DoubleSide}
              />
            </mesh>
          ))} */}

          <OrbitControls
            ref={controlsRef}
            enableDamping={false}
            autoRotate={autoRotate && !hovered && interaction != "all"}
            autoRotateSpeed={interaction == "none" ? 0.4 : 0.2}
            maxDistance={50}
            minDistance={1}
            enableZoom={interaction == "all"}
            enablePan={interaction == "all"}
            makeDefault
          />
          {interaction == "all" && (
            <GizmoHelper alignment="bottom-right" margin={gizmoPosition.current}>
              <group scale={[1.2, 1.2, 1.2]}>
                <GizmoViewcube
                  faces={["Bow", "Stern", "Deck", "Keel", "Starboard", "Port"]}
                  color="rgb(255, 255, 255)"
                  hoverColor="#ffc020"
                  textColor="#030303"
                  font="18px Helvetica"
                />
              </group>
            </GizmoHelper>
          )}
        </Canvas>
        {loaded && (
          <HoverDisplay
            layer={hovered}
            materials={materials}
            settings={settings}
            componentParts={componentParts}
          />
        )}
      </div>
    </div>
  );
}
