"use client";

import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

interface AxisSliderProps {
  min: number;
  max: number;
  axis: "x" | "y" | "z";
  value: [number, number];
  handleChange: (axis: "x" | "y" | "z", value: [number, number]) => void;
}

export function AxisSlider({
  min,
  max,
  axis,
  value,
  handleChange,
}: AxisSliderProps) {
  return (
    <div
      style={{
        width: "8rem",
        gap: "1rem",
        position: "relative",
      }}
    >
      <RangeSlider
        min={min}
        max={max}
        step={0.001}
        defaultValue={[min, max]}
        value={value}
        key={`${axis}-${min}-${max}`}
        onInput={(value) => handleChange(axis, value)}
      />
    </div>
  );
}
