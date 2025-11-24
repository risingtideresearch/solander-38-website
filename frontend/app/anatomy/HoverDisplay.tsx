import { useState, useEffect } from "react";
import {
  INCHES_TO_METERS,
  MaterialIndex,
  Model,
  weightData,
} from "./three-d/util";

interface HoverDisplayProps {
  layer: Model | null;
  materials: MaterialIndex;
}

const formatFeetInches = (totalInches) => {
  // const feet = Math.floor(totalInches / 12);
  // const inches = Math.round(totalInches % 12);

  // if (feet === 0) {
  //   return `${inches}"`;
  // } else if (inches === 0) {
  //   return `${feet}'`;
  // } else {
  //   return `${feet}' ${inches}"`;
  // }

  return (totalInches / 12).toFixed(1) + "\'";
};

export default function HoverDisplay({ layer, materials }: HoverDisplayProps) {
  const [displayLayer, setDisplayLayer] = useState(layer);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (layer && layer.layer_name) {
      // Show immediately when layer is set
      setDisplayLayer(layer);
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [layer]);

  if (!displayLayer || !displayLayer.layer_name) {
    return <></>;
  }

  const parts = displayLayer.layer_name.split("::");
  const last = parts[parts.length - 1];

  return (
    <div
      className="pane"
      style={{
        position: "fixed",
        bottom: "0.5rem",
        left: "0.5rem",
        minWidth: "15rem",
        maxWidth: "18rem",
        zIndex: 10,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 200ms",
        border: "1px solid",
        borderTop: "none",
        pointerEvents: "none",
        lineHeight: 1.4,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "7rem 1fr",
          borderTop: "1px solid",
        }}
      >
        <h6 style={{ padding: "0.5rem", borderRight: "1px solid" }}>Part</h6>
        <h6 style={{ padding: "0.5rem", textWrap: "pretty" }}>
          {last
            .toLowerCase()
            .replace("surfs", "")
            .replace("surfaces", "")
            .replace("mesh", "")
            .replace("_", '"')}
        </h6>
      </div>
      {materials[displayLayer?.filename] ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "7rem 1fr",
            borderTop: "1px solid",
          }}
        >
          <h6 style={{ padding: "0.5rem", borderRight: "1px solid" }}>
            Material
          </h6>
          <h6 style={{ padding: "0.5rem" }}>
            {materials[displayLayer?.filename]?.join(", ")}
          </h6>
        </div>
      ) : (
        <></>
      )}
      {weightData[displayLayer?.filename] ? (
        <>
          {weightData[displayLayer?.filename].quantity > 1 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "7rem 1fr",
                borderTop: "1px solid",
              }}
            >
              <h6 style={{ padding: "0.5rem", borderRight: "1px solid" }}>
                {"Quantity"}
              </h6>
              <h6 style={{ padding: "0.5rem" }}>
                {weightData[displayLayer?.filename].quantity}
              </h6>
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "7rem 1fr",
              borderTop: "1px solid",
            }}
          >
            <h6 style={{ padding: "0.5rem", borderRight: "1px solid" }}>
              {"Weight (LB)"}
            </h6>
            <h6 style={{ padding: "0.5rem" }}>
              {Math.round(weightData[displayLayer?.filename].quantity *
                weightData[displayLayer?.filename].weightPerUnit)}
              {weightData[displayLayer?.filename].quantity > 1
                ? ` (${weightData[displayLayer?.filename].weightPerUnit} / unit)`
                : ""}
            </h6>
          </div>
        </>
      ) : (
        <></>
      )}
      {/* {displayLayer.normalized_size ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "7rem 1fr",
            borderTop: "1px solid",
          }}
        >
          <h6 style={{ padding: "0.5rem", borderRight: "1px solid" }}>Size</h6>
          <h6 style={{ padding: "0.5rem" }}>
            {formatFeetInches(displayLayer.normalized_size.width)} W ×{" "}
            {formatFeetInches(displayLayer.normalized_size.length)} L ×{" "}
            {formatFeetInches(displayLayer.normalized_size.height)} H
          </h6>
        </div>
      ) : (
        <></>
      )} */}
    </div>
  );
}
