"use client";
import { AxisSlider } from "@/app/components/AxisSlider";
import { MdOutlineFlip } from "react-icons/md";

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
    <div style={{ position: "fixed", top: "8rem", right: "0.5rem" }}>
      {/* <label>
          <select
            value={settings.units}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, units: e.target.value as Units }))
            }
            style={LABEL_STYLES}
          >
            {Object.values(Units).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label> */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2rem",
          columnGap: "0.5rem",
          alignItems: "center",
        }}
      >
        <span style={{ opacity: loaded ? 1 : 0, transition: "400ms opacity" }}>
          <AxisSlider
            min={0}
            max={1}
            value={clippingValues.value}
            axis={clippingValues.axis}
            handleChange={setClippingValues}
          />
        </span>
        <button
          style={{ border: "1px solid" }}
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
          <MdOutlineFlip
            style={{
              transform: `rotate(${clippingValues.axis == "y" ? "90deg" : clippingValues.axis == "z" ? "180deg" : "0deg"})`,
            }}
            size={18}
          />
        </button>

        <h6
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: loaded ? 1 : 0,
            transition: "400ms opacity",
          }}
        >
          {clippingValues.axis == "x" ? (
            <>
              <span>Stern</span>
              <span style={{ borderTop: "1px solid", flex: "1 1 auto" }}></span>
              <span>Bow</span>
            </>
          ) : clippingValues.axis == "y" ? (
            <>
              <span>Keel</span>
              <span style={{ borderTop: "1px solid", flex: "1 1 auto" }}></span>
              <span>Deck</span>
            </>
          ) : (
            <>
              <span>Port</span>
              <span style={{ borderTop: "1px solid", flex: "1 1 auto" }}></span>
              <span>Starboard</span>
            </>
          )}
        </h6>
      </div>
    </div>
  );
}
