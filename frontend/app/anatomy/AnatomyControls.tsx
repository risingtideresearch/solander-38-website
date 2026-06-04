"use client";

import { useState } from "react";
import { LiaRulerHorizontalSolid } from "react-icons/lia";
import { BiInfoCircle } from "react-icons/bi";
import { AnatomyInfoModal } from "./AnatomyInfoModal";
import { TransparencyIcon } from "./TransparencyIcon";
import { ClippingPlaneControls } from "./ClippingPlaneControls";
import { Units } from "./three-d/util";
import { ClippingValues } from "./three-d/Canvas3D";
import { ControlSettings } from "./Anatomy";
import styles from "./anatomy-controls.module.scss";
import { MdCrop, MdOutlineFlip } from "react-icons/md";

interface IAnatomyControls {
  clippingValues: ClippingValues;
  setClippingValues: (val: {
    axis: "x" | "y" | "z";
    value: [number, number];
  }) => void;
  loaded: boolean;
  settings: ControlSettings;
  setSettings: (val: ControlSettings) => void;
  anatomyDescription?: string;
  lastUpdated?: Date | string;
}

export default function AnatomyControls({
  clippingValues,
  setClippingValues,
  loaded,
  settings,
  setSettings,
  anatomyDescription,
  lastUpdated,
}: IAnatomyControls) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={styles.controls}>
      <button
        aria-label="More info"
        data-tooltip="More info"
        onClick={() => setShowInfo(true)}
      >
        <BiInfoCircle size={18} />
      </button>

      <AnatomyInfoModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        anatomyDescription={anatomyDescription}
        lastUpdated={lastUpdated}
      />

      <button
        aria-label="Toggle scale lines"
        data-tooltip="Toggle scale lines"
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
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(45deg)",
              borderTop: "1px solid var(--black)",
              width: "85%",
            }}
          ></span>
        )}
      </button>
      <button
        aria-label="Change units"
        data-tooltip="Change units"
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
        aria-label="Toggle transparency"
        data-tooltip="Toggle transparency"
        onClick={() =>
          setSettings({ ...settings, transparent: !settings.transparent })
        }
      >
        <TransparencyIcon on={settings.transparent} />
      </button>
      <button
        aria-label="Toggle clipping plane"
        data-tooltip="Toggle clipping plane"
        onClick={() =>
          setSettings({ ...settings, showClipping: !settings.showClipping })
        }
      >
        <MdOutlineFlip size={18} />
        {!settings.showClipping && (
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(45deg)",
              borderTop: "1px solid var(--black)",
              width: "85%",
            }}
          ></span>
        )}
      </button>

      {settings.showClipping && loaded ? (
        <ClippingPlaneControls
          clippingValues={clippingValues}
          setClippingValues={(axis, value) =>
            setClippingValues({ axis, value })
          }
          loaded={loaded}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
