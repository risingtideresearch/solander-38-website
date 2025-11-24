"use client";
import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import { DoubleSide, Mesh, Plane, Color, Group } from "three";
import { ControlSettings } from "../Anatomy";

type Model3DProps = {
  url: string;
  onLoad?: () => void;
  clippingPlanes?: Plane[];
  settings: ControlSettings;
};

const ORIGINAL_POSITION = [0, 0, 0] as const;
const TRANSPARENT_OPACITY = 0.18;
const OPAQUE_OPACITY = 1.0;

export function Model3D({
  url,
  onLoad,
  clippingPlanes = [],
  settings,
}: Model3DProps) {
  const { scene } = useGLTF("/models/" + url);

  const ref = useRef<Group>(null);
  const isInitialized = useRef(false);

  const layerName = useMemo(() => url.replace(".glb", ""), [url]);

  const configureMaterial = useCallback(
    (mat) => {
      mat.side = DoubleSide;
      if (!settings.transparent) {
        mat.clippingPlanes = clippingPlanes;
      }

      if (mat.name == "Plastic") {
        (mat.color as Color).set(1, 0.3, 0);
      }

      if ("metalness" in mat && "roughness" in mat) {
        if (mat.name.includes("Alum")) {
          mat.metalness = 1.0;
          mat.roughness = 0.2;
        } else if (mat.name.includes("Wood") || mat.name.includes("Plastic")) {
          mat.metalness = 1.0;
          mat.roughness = 1.0;
        }
      }
    },
    [clippingPlanes, settings],
  );

  const configureMesh = useCallback(
    (mesh: Mesh) => {
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach(configureMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    },
    [configureMaterial],
  );

  useEffect(() => {
    if (!ref.current || isInitialized.current) return;

    isInitialized.current = true;
    scene.name = layerName;
    scene.userData = {
      ...scene.userData,
      url: url,
      layerName: layerName,
      isLayer: true,
      originalUrl: url,
    };

    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        configureMesh(child as Mesh);
      }
    });

    onLoad?.();
  }, [scene, layerName, url, configureMesh]);

  useEffect(() => {
    if (!ref.current) return;

    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        materials.forEach((mat) => {
          if (!mat.userData.originalColor) {
            mat.userData.originalColor = mat.color.clone();
          }

          mat.transparent = settings.transparent || false;
          mat.depthWrite = !settings.transparent;
          mat.opacity = settings.transparent
            ? TRANSPARENT_OPACITY
            : OPAQUE_OPACITY;
          mat.clippingPlanes = settings.transparent ? [] : clippingPlanes;

          if (settings.transparent) {
            mat.color.set(0xf0f8ff);
          } else {
            mat.color.copy(mat.userData.originalColor);
          }
        });
      }
    });
  }, [scene, settings.transparent, clippingPlanes]);

  return (
    <primitive
      ref={ref}
      object={scene}
      dispose={null}
      position={ORIGINAL_POSITION}
    />
  );
}
