"use client";

import { useCallback, useState } from "react";
import { contextualLayers, Units } from "./three-d/util";
import { Plane, Vector3, Box3 } from "three";
import { Canvas3D } from "./three-d/Canvas3D";
import { ClippingPlaneControls } from "./three-d/ClippingPlaneControls";

export type ControlSettings = {
  transparent?: boolean;
  expand: boolean;
  units?: Units;
  monochrome?: boolean;
};

export interface ClippingPlanes {
  [key: string]: Plane;
}

const INITIAL_CLIPPING_PLANES: ClippingPlanes = {
  x1: new Plane(new Vector3(1, 0, 0), 13),
  x2: new Plane(new Vector3(-1, 0, 0), 2),
  y1: new Plane(new Vector3(0, 1, 0), 10),
  y2: new Plane(new Vector3(0, -1, 0), 10),
  z1: new Plane(new Vector3(0, 0, 1), 5),
  z2: new Plane(new Vector3(0, 0, -1), 5),
};

export default function ThreeDContainer({
  filteredLayers,
  boundingBox,
  settings,
  setSettings,
}) {
  const [clippingPlanes, setClippingPlanes] = useState<ClippingPlanes>(
    INITIAL_CLIPPING_PLANES,
  );

  const handleSetClippingPlane = useCallback((dir: string, value: Plane) => {
    setClippingPlanes((prev) => ({
      ...prev,
      [dir]: value,
    }));
  }, []);

  return (
    <>
      <Canvas3D
        clippingPlanes={clippingPlanes}
        filteredLayers={
          settings.transparent
            ? [...filteredLayers.filter(layer => !contextualLayers.includes(layer)), ...contextualLayers]
            : filteredLayers
        }
        settings={settings}
        boundingBox={boundingBox}
      />

      <ClippingPlaneControls
        settings={settings}
        setSettings={setSettings}
        setClippingPlane={handleSetClippingPlane}
        boundingBox={boundingBox}
      />

      <button
        onClick={() =>
          setSettings((prev) => ({ ...prev, transparent: !prev.transparent }))
        }
        style={{
          position: "absolute",
          right: "0.5rem",
          top: "8rem",
          border: "1px solid",
        }}
      >
        {settings.transparent ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M34 31.5V26H28.5V31.5H34ZM170 77H175.5V74.7396L173.911 73.1325L170 77ZM125 31.5L128.911 27.6325L127.296 26H125V31.5ZM170 171V176.5H175.5V171H170ZM34 126H28.5V128.224L30.0456 129.823L34 126ZM77.5 171L73.5456 174.823L77.5 176.5V171ZM34 31.5L30.0245 35.3007L73.5245 80.8007L77.5 77L81.4755 73.1993L37.9755 27.6993L34 31.5ZM77.5 77V82.5H170V77V71.5H77.5V77ZM170 77L173.911 73.1325L128.911 27.6325L125 31.5L121.089 35.3675L166.089 80.8675L170 77ZM125 31.5V26H34V31.5V37H125V31.5ZM170 171H175.5V77H170H164.5V171H170ZM34 31.5H28.5V126H34H39.5V31.5H34ZM77.5 77H72V171H77.5H83V77H77.5ZM77.5 171V176.5H170V171V165.5H77.5V171ZM34 126L30.0456 129.823L73.5456 174.823L77.5 171L81.4544 167.177L37.9544 122.177L34 126Z"
              fill="black"
            />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M34 31.5V26H28.5V31.5H34ZM170 77H175.5V74.7396L173.911 73.1325L170 77ZM125 31.5L128.911 27.6325L127.296 26H125V31.5ZM170 171V176.5H175.5V171H170ZM34 126H28.5V128.224L30.0456 129.823L34 126ZM77.5 171L73.5456 174.823L77.5 176.5V171ZM34 31.5L30.0245 35.3007L73.5245 80.8007L77.5 77L81.4755 73.1993L37.9755 27.6993L34 31.5ZM77.5 77V82.5H170V77V71.5H77.5V77ZM170 77L173.911 73.1325L128.911 27.6325L125 31.5L121.089 35.3675L166.089 80.8675L170 77ZM125 31.5V26H34V31.5V37H125V31.5ZM125 31.5H119.5V126H125H130.5V31.5H125ZM125 126L121.111 129.889L166.111 174.889L170 171L173.889 167.111L128.889 122.111L125 126ZM170 171H175.5V77H170H164.5V171H170ZM34 31.5H28.5V126H34H39.5V31.5H34ZM34 126V131.5H125V126V120.5H34V126ZM77.5 77H72V171H77.5H83V77H77.5ZM77.5 171V176.5H170V171V165.5H77.5V171ZM34 126L30.0456 129.823L73.5456 174.823L77.5 171L81.4544 167.177L37.9544 122.177L34 126Z"
              fill="black"
            />
          </svg>
        )}
      </button>
    </>
  );
}
