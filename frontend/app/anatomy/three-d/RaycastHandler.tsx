import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';
import { useEffect, useRef } from "react";

export default function RaycastHandler({ clippingPlanes, setHovered }) {
  const { camera, scene, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const hoveredObject = useRef<THREE.Object3D | null>(null);
  const originalColor = useRef<THREE.Color | null>(null);
  const originalMap = useRef<THREE.Texture | null>(null);
  const originalEmissive = useRef<THREE.Color | null>(null);
  const originalEmissiveIntensity = useRef<number>(0);
  const originalMetalness = useRef<number>(0);
  const originalRoughness = useRef<number>(0);

  const findParentLayer = (
    object: THREE.Object3D
  ): { name: string | null; url?: string; layer?: THREE.Object3D } => {
    let current = object;

    while (current) {
      if (current.userData?.url) {
        return {
          name: current.userData.layerName,
          url: current.userData?.url || current.userData?.originalUrl,
          layer: current,
        };
      }
      current = current.parent as THREE.Object3D;
    }

    return { name: object.name };
  };

  const isLayerTransparent = (object: THREE.Object3D): boolean => {
    const mesh = object as THREE.Mesh;
    if (!mesh.material) return false;

    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    // Check if any material is transparent
    return materials.some(mat => mat.transparent === true);
  };

  const resetHoveredObject = () => {
    if (hoveredObject.current && originalColor.current) {
      const mat = (hoveredObject.current as THREE.Mesh)
        .material as THREE.MeshStandardMaterial;
      if (mat && mat.color) {
        mat.color.copy(originalColor.current);
        mat.map = originalMap.current;
        if (originalEmissive.current) mat.emissive.copy(originalEmissive.current);
        mat.emissiveIntensity = originalEmissiveIntensity.current;
        mat.metalness = originalMetalness.current;
        mat.roughness = originalRoughness.current;
        mat.needsUpdate = true;
      }
      hoveredObject.current = null;
      originalColor.current = null;
      originalMap.current = null;
      originalEmissive.current = null;
      setHovered(null);
    }
  };

  const setHoverColor = (object: THREE.Object3D) => {
    const mesh = object as THREE.Mesh;
    const mat = mesh.material as THREE.MeshStandardMaterial;

    if (mat && mat.color && !object.userData.ignore) {
      if (hoveredObject.current && hoveredObject.current !== object) {
        resetHoveredObject();
      }

      if (hoveredObject.current !== object) {
        originalColor.current = mat.color.clone();
        originalMap.current = mat.map;
        originalEmissive.current = mat.emissive.clone();
        originalEmissiveIntensity.current = mat.emissiveIntensity;
        originalMetalness.current = mat.metalness;
        originalRoughness.current = mat.roughness;
        hoveredObject.current = object;
        mat.color.set(0x888888);
        mat.map = null;
        mat.emissive.set("#65a5b4");
        mat.emissiveIntensity = 0.4;
        mat.metalness = 0.9;
        mat.roughness = 1.0;
        mat.needsUpdate = true;
      }
    }
  };

  const isPointClipped = (point: THREE.Vector3): boolean => {
    if (!clippingPlanes) return false;

    for (let i = 0; i < clippingPlanes.length; i += 1) {
      if (clippingPlanes[i].distanceToPoint(point) < 0) {
        return true;
      }
    }
    return false;
  };

  const filterClippedIntersections = (
    intersects: THREE.Intersection[]
  ): THREE.Intersection[] => {
    if (!clippingPlanes) return intersects;

    return intersects.filter((intersect) => {
      const { point, object } = intersect;

      // Ignore transparent objects
      if (isLayerTransparent(object)) {
        return false;
      }

      if (isPointClipped(point)) {
        return false;
      }

      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());

      if (isPointClipped(center)) {
        const corners = [
          new THREE.Vector3(box.min.x, box.min.y, box.min.z),
          new THREE.Vector3(box.min.x, box.min.y, box.max.z),
          new THREE.Vector3(box.min.x, box.max.y, box.min.z),
          new THREE.Vector3(box.min.x, box.max.y, box.max.z),
          new THREE.Vector3(box.max.x, box.min.y, box.min.z),
          new THREE.Vector3(box.max.x, box.min.y, box.max.z),
          new THREE.Vector3(box.max.x, box.max.y, box.min.z),
          new THREE.Vector3(box.max.x, box.max.y, box.max.z),
        ];

        const hasVisibleCorner = corners.some(
          (corner) => !isPointClipped(corner)
        );
        if (!hasVisibleCorner) {
          return false;
        }
      }

      return true;
    });
  };

  const isInsideCanvas = useRef(false);
  const lastTouchedUrl = useRef<string | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const performTouchRaycast = (clientX: number, clientY: number) => {
    const canvas = gl.domElement;
    const rect = canvas.getBoundingClientRect();
    const touchMouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );

    raycaster.current.setFromCamera(touchMouse, camera);
    const intersects = raycaster.current.intersectObjects(scene.children, true);
    const visibleIntersects = filterClippedIntersections(intersects);

    if (visibleIntersects.length > 0) {
      const layerInfo = findParentLayer(visibleIntersects[0].object);
      if (layerInfo.url && layerInfo.url === lastTouchedUrl.current) {
        resetHoveredObject();
        lastTouchedUrl.current = null;
      } else {
        setHoverColor(visibleIntersects[0].object);
        setHovered(layerInfo);
        lastTouchedUrl.current = layerInfo.url ?? null;
      }
    } else {
      resetHoveredObject();
      lastTouchedUrl.current = null;
    }
  };

  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseMove = (event: PointerEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      isInsideCanvas.current = isInside;

      if (isInside) {
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      } else {
        resetHoveredObject();
      }
    };

    const onMouseLeave = () => {
      isInsideCanvas.current = false;
      resetHoveredObject();
    };

    const onTouchStart = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      touchStartPos.current = { x: event.clientX, y: event.clientY };
    };

    const onTouchEnd = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      if (!touchStartPos.current) return;
      const dx = event.clientX - touchStartPos.current.x;
      const dy = event.clientY - touchStartPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      touchStartPos.current = null;
      if (dist < 10) {
        performTouchRaycast(event.clientX, event.clientY);
      }
    };

    canvas.addEventListener("pointermove", onMouseMove);
    canvas.addEventListener("pointerleave", onMouseLeave);
    canvas.addEventListener("pointerdown", onTouchStart);
    canvas.addEventListener("pointerup", onTouchEnd);

    return () => {
      canvas.removeEventListener("pointermove", onMouseMove);
      canvas.removeEventListener("pointerleave", onMouseLeave);
      canvas.removeEventListener("pointerdown", onTouchStart);
      canvas.removeEventListener("pointerup", onTouchEnd);
      resetHoveredObject();
    };
  }, [gl]);

  useFrame(() => {
    if (
      typeof window === "undefined" ||
      !scene ||
      !camera ||
      !isInsideCanvas.current
    )
      return;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObjects(scene.children, true);
    const visibleIntersects = filterClippedIntersections(intersects);

    if (visibleIntersects.length > 0) {
      const layerInfo = findParentLayer(visibleIntersects[0].object);
      setHovered(layerInfo);
      setHoverColor(visibleIntersects[0].object);
    } else {
      resetHoveredObject();
    }
  });

  return null;
}
