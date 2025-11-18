import { INCHES_TO_METERS, MaterialIndex, Model } from "./three-d/util";

interface HoverDisplayProps {
    layer: Model;
    materials: MaterialIndex
}

export default function HoverDisplay({ layer, materials }: HoverDisplayProps) {
  if (!layer || !layer.layer_name) {
    return <></>;
  }

  const parts = layer.layer_name.split("::");
  const last = parts[parts.length - 1];

  return (
    <div
      className="pane"
      style={{
        position: "fixed",
        bottom: "0.5rem",
        left: "0.5rem",
        maxWidth: "25rem",
        zIndex: 10,
        opacity: layer ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
        border: "1px solid",
        borderTop: "none",
        pointerEvents: "none",
        width: "16.5rem",
        lineHeight: 1.4,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "6rem 1fr",
          borderTop: "1px solid",
        }}
      >
        <h6 style={{ padding: "0.5rem", borderRight: "1px solid" }}>Part</h6>
        <h6 style={{ padding: "0.5rem" }}>
          {last
            .toLowerCase()
            .replace("surfs", "")
            .replace("surfaces", "")
            .replace("mesh", "")
            .replace("_", "\"")}
        </h6>
      </div>
      {materials[layer?.filename] ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "6rem 1fr",
            borderTop: "1px solid",
          }}
        >
          <h6 style={{ padding: "0.5rem", borderRight: "1px solid" }}>
            Material
          </h6>
          <h6 style={{ padding: "0.5rem" }}>
            {materials[layer?.filename]?.join(", ")}
          </h6>
        </div>
      ) : (
        <></>
      )}
      {/* {layer.normalized_size ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "6rem 1fr",
            borderTop: "1px solid",
          }}
        >
          <h6 style={{ padding: "0.5rem", borderRight: "1px solid" }}>
            Size
          </h6>
          <h6 style={{ padding: "0.5rem" }}>
            {(layer.normalized_size.width * INCHES_TO_METERS).toFixed(1)}" W × {" "}
            {(layer.normalized_size.length * INCHES_TO_METERS).toFixed(1)}" L × {" "}
            {(layer.normalized_size.height * INCHES_TO_METERS).toFixed(1)}" H
          </h6>
        </div>
      ) : (
        <></>
      )} */}
    </div>
  );
}
