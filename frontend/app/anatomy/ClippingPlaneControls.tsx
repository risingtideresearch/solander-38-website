"use client";
import { AxisSlider } from "@/app/components/AxisSlider";
import styles from "./anatomy-controls.module.scss";
import { BsArrowsVertical } from "react-icons/bs";

interface ClippingPlaneControlsProps {
  clippingValues: { axis: "x" | "y" | "z"; value: [number, number] };
  setClippingValues: (axis: "x" | "y" | "z", value: [number, number]) => void;
  loaded: boolean;
}

export function ClippingPlaneControls({
  clippingValues,
  setClippingValues,
  loaded,
}: ClippingPlaneControlsProps) {
  return (
    <div>
      <span
        className={styles['clipping-control-container']}
        style={{
          opacity: loaded ? 1 : 0,
        }}
      >
        <AxisSlider
          min={0}
          max={1}
          value={clippingValues.value}
          axis={clippingValues.axis}
          handleChange={setClippingValues}
        />

        <h6
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: loaded ? 1 : 0,
            transition: "400ms opacity",
            marginTop: "0.5rem",
          }}
        >
          {clippingValues.axis == "x" ? (
            <>
              <span>Stern</span>
              <span
                style={{
                  borderTop: "1px solid var(--black)",
                  flex: "1 1 auto",
                }}
              ></span>
              <span>Bow</span>
            </>
          ) : clippingValues.axis == "y" ? (
            <>
              <span>Keel</span>
              <span
                style={{
                  borderTop: "1px solid var(--black)",
                  flex: "1 1 auto",
                }}
              ></span>
              <span>Deck</span>
            </>
          ) : (
            <>
              <span>Port</span>
              <span
                style={{
                  borderTop: "1px solid var(--black)",
                  flex: "1 1 auto",
                }}
              ></span>
              <span>Starboard</span>
            </>
          )}
        </h6>
      </span>
      <button
        aria-label="Rotate clipping plane axis"
        data-tooltip="Rotate clipping plane axis"
        style={{ border: "1px solid var(--black)" }}
        onClick={() =>
          setClippingValues(
            clippingValues.axis == "x"
              ? "z"
              : clippingValues.axis == "y"
                ? "x"
                : "y",
            [0, 1],
          )
        }
      >
        <BsArrowsVertical
          style={{
            transform: `rotate(${clippingValues.axis == "y" ? "180deg" : clippingValues.axis == "z" ? "90deg" : "-45deg"})`,
          }}
          size={18}
        />
      </button>
    </div>
  );
}
