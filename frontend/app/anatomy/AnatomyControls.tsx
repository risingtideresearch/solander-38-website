"use client";

import { LiaRulerHorizontalSolid } from "react-icons/lia";
import { ClippingPlaneControls } from "./ClippingPlaneControls";
import Info from "./Info";
import { Units } from "./three-d/util";
import { ClippingValues } from "./three-d/Canvas3D";
import { ControlSettings } from "./Anatomy";
import styles from "./anatomy-controls.module.scss";

interface IAnatomyControls {
  clippingValues: ClippingValues;
  setClippingValues: (val: {
    axis: "x" | "y" | "z";
    value: [number, number];
  }) => void;
  loaded: boolean;
  settings: ControlSettings;
  setSettings: (val: ControlSettings) => void;
}

export default function AnatomyControls({
  clippingValues,
  setClippingValues,
  loaded,
  settings,
  setSettings,
}: IAnatomyControls) {
  return (
    <div className={styles.controls}>
      <button
        onClick={() =>
          setSettings({ ...settings, transparent: !settings.transparent })
        }
      >
        {!settings.transparent ? (
          <svg
            width="18"
            height="18"
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
            width="18"
            height="18"
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

      <button
        onClick={() =>
          setSettings({
            ...settings,
            units: settings.units == Units.Feet ? Units.Meters : Units.Feet,
          })
        }
      >
        <h6>{settings.units == Units.Meters ? "M" : "FT"}</h6>
      </button>

      <button
        onClick={() =>
          setSettings({
            ...settings,
            scalingLines: !settings.scalingLines,
          })
        }
      >
        <LiaRulerHorizontalSolid size={18} />
        {!settings.scalingLines && (
          <span
            style={{
              position: "absolute",
              top: '50%',
              left: '50%',
              transform: "translate(-50%, -50%) rotate(45deg)",
              borderTop: "1px solid",
              width: "85%",
            }}
          ></span>
        )}
      </button>

      <span style={settings.scalingLines ? {} : { visibility: "hidden" }}>
        <ClippingPlaneControls
          clippingValues={clippingValues}
          setClippingValues={(axis, value) =>
            setClippingValues({ axis, value })
          }
          loaded={loaded}
        />
      </span>
    </div>
  );
}
