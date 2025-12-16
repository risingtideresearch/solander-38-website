import { useState, useEffect, useContext } from "react";
import {
  INCHES_TO_METERS,
  MaterialIndex,
  Model,
  systemWeightData,
  weightData,
} from "./three-d/util";
import { TOCContext } from "../toc/TableOfContents";

interface HoverDisplayProps {
  layer: Model | null;
  materials: MaterialIndex;
}

const formatFeetInches = (totalInches) => {
  return (totalInches / 12).toFixed(1) + "'";
};

export default function HoverDisplay({ layer, materials }: HoverDisplayProps) {
  const [displayLayer, setDisplayLayer] = useState(layer);
  const [isVisible, setIsVisible] = useState(false);
  const { article } = useContext(TOCContext);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (layer && layer.layer_name) {
      setDisplayLayer(layer);
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [layer]);

  // Calculate position to keep tooltip on screen
  const getTooltipPosition = () => {
    const offset = 0;
    const padding = 10;
    let flip = "";
    if (typeof window === "undefined") {
      return { x: 0, y: 0 };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const tooltipWidth = tooltipSize.width || 288;
    const tooltipHeight = tooltipSize.height || 200;

    let x = Math.round(mouse.x + offset);
    let y = 48; //mouse.y - offset - tooltipHeight;

    if (x + tooltipWidth + padding > viewportWidth) {
      x = mouse.x - tooltipWidth - offset;
      flip = "x";
    }

    if (y + tooltipHeight + padding > viewportHeight) {
      y = mouse.y - tooltipHeight - offset;
      flip = "y";
    }

    if (x < padding) {
      x = padding;
    }

    if (y < padding) {
      y = padding;
    }

    return { x, y, flip };
  };

  const position = getTooltipPosition();

  if (!displayLayer || !displayLayer.layer_name) {
    return <></>;
  }

  const parts = displayLayer.layer_name.split("::");
  const last = parts[parts.length - 1];

  const roundToSignificantDigit = (num: number) => {
    const magnitude = Math.min(Math.pow(10, Math.floor(Math.log10(num))), 100);
    return Math.round(num / magnitude) * magnitude;
  };

  return (
    <>
      <div
        ref={(el) => {
          if (el && el.offsetHeight !== tooltipSize.height) {
            setTooltipSize({ width: el.offsetWidth, height: el.offsetHeight });
          }
        }}
        className="pane"
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          pointerEvents: "none",
          zIndex: 9999,
          minWidth: "15rem",
          maxWidth: "19rem",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 200ms",
          border: "1px solid",
          borderTop: "none",
          background: "#ffffffc3",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "8.25rem 1fr",
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
              .replace("simplified", "")
              .replace("approx.", "")
              .replace("_", '"')}
          </h6>
        </div>
        {/* <div
          style={{
            display: "grid",
            gridTemplateColumns: "8.25rem 1fr",
            borderTop: "1px solid",
          }}
        >
          <h6 style={{ padding: "0.5rem", borderRight: "1px solid" }}>
            File size
          </h6>
          <h6 style={{ padding: "0.5rem" }}>
            {Math.round(displayLayer?.file_size / 10000) / 100} MB
          </h6>
        </div> */}
        {materials[displayLayer?.filename] ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "8.25rem 1fr",
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

        {systemWeightData[displayLayer?.system] && !article ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "8.25rem 1fr",
              borderTop: "1px solid",
            }}
          >
            <h6 style={{ padding: "0.5rem", borderRight: "1px solid" }}>
              {`${displayLayer.system} weight (lb)`}
            </h6>
            <h6 style={{ padding: "0.5rem" }}>
              {roundToSignificantDigit(
                systemWeightData[displayLayer?.system].weight,
              )}
            </h6>
          </div>
        ) : weightData[displayLayer?.filename] ? (
          <>
            {weightData[displayLayer?.filename].quantity > 1 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "8.25rem 1fr",
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
                gridTemplateColumns: "8.25rem 1fr",
                borderTop: "1px solid",
              }}
            >
              <h6 style={{ padding: "0.5rem", borderRight: "1px solid" }}>
                {"Approx Wt (LB)"}
              </h6>
              <h6 style={{ padding: "0.5rem" }}>
                {roundToSignificantDigit(
                  weightData[displayLayer?.filename].quantity *
                    weightData[displayLayer?.filename].weightPerUnit,
                )}
                {weightData[displayLayer?.filename].quantity > 1
                  ? ` (${parseFloat(
                      (
                        roundToSignificantDigit(
                          weightData[displayLayer?.filename].quantity *
                            weightData[displayLayer?.filename].weightPerUnit,
                        ) / weightData[displayLayer?.filename].quantity
                      ).toFixed(1),
                    )} / unit)`
                  : ""}
              </h6>
            </div>
          </>
        ) : (
          <></>
        )}

        <div
          style={{
            position: "absolute",
            left: position.flip == "x" ? "auto" : -1,
            right: position.flip == "x" ? -1 : "auto",
            top: 0,
            width: 1,
            height: Math.abs(mouse.y - position.y),
            opacity: isVisible ? 1 : 0,
            transition: "opacity 200ms",
            borderLeft: "1px solid",
          }}
        >
        </div>
      </div>
    </>
  );
}
