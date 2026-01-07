"use client";
import { useState } from "react";
import styles from "./range-chart.module.scss";

export default function RangeChart() {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: unknown;
  } | null>(null);

  const xTicks = [5, 6, 7, 8, 9, 10];
  const kwTicks = [
    { speed: 5, kw: 2 },
    { speed: 6, kw: 4.5 },
    { speed: 7, kw: 8 },
    { speed: 8, kw: 13 },
    { speed: 9, kw: 20 },
    { speed: 10, kw: 30 },
  ];
  const yTicks = [0, 100, 200, 300, 400, 500, 600];
  const margin = { top: 50, right: 80, bottom: 180, left: 80 };
  const dim = [
    (xTicks.length - 1) * 80 + margin.right + margin.left,
    (yTicks.length - 1) * 80 + margin.top + margin.bottom,
  ];
  const chartWidth = dim[0] - margin.left - margin.right;
  const chartHeight = dim[1] - margin.top - margin.bottom;

  const allData = {
    battery: {
      key: "no-solar",
      label: "Full battery",
      sublabel: "without additional solar",
      dashArray: "7 3",
      color: "#000",
      values: [
        { speed: 5, range: 250, kw: 2 },
        { speed: 6, range: 133, kw: 4.5 },
        { speed: 7, range: 88, kw: 8 },
        { speed: 8, range: 62, kw: 13 },
        { speed: 9, range: 45, kw: 20 },
        { speed: 10, range: 33, kw: 30 },
      ],
      kWh: 100,
    },
    "solar-winter": {
      key: "solar-pnw-winter",
      label: "Low solar",
      sublabel: "e.g. PNW winter",
      dashArray: "3 3",
      color: "#000",
      values: [
        { speed: 5, range: 88, kw: 2 },
        { speed: 6, range: 47, kw: 4.5 },
        { speed: 7, range: 31, kw: 8 },
        { speed: 8, range: 22, kw: 13 },
        { speed: 9, range: 16, kw: 20 },
        { speed: 10, range: 12, kw: 30 },
      ],
      kWh: 35,
    },
    "solar-summer": {
      key: "solar-pnw-summer",
      label: "High solar ",
      sublabel: "e.g. PNW summer",
      dashArray: "",
      color: "#000",
      values: [
        { speed: 5, range: 588, kw: 2 },
        { speed: 6, range: 313, kw: 4.5 },
        { speed: 7, range: 206, kw: 8 },
        { speed: 8, range: 145, kw: 13 },
        { speed: 9, range: 106, kw: 20 },
        { speed: 10, range: 78, kw: 30 },
      ],
      kWh: 235,
    },
  };

  const xScale = (speed) => {
    const minSpeed = 10;
    const maxSpeed = 5;
    return (
      margin.left + ((maxSpeed - speed) / (maxSpeed - minSpeed)) * chartWidth
    );
  };

  const yScale = (range) => {
    const minRange = 0;
    const maxRange = 600;
    return (
      dim[1] -
      margin.bottom -
      ((range - minRange) / (maxRange - minRange)) * chartHeight
    );
  };

  const dataToPath = (values) => {
    return values
      .map((point, i) => {
        const x = xScale(point.speed);
        const y = yScale(point.range);
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(" ");
  };

  const handleMouseEnter = (datasetKey, point, e) => {
    const dataset = allData[datasetKey];
    setTooltip({
      x: Math.min(e.clientX, window.innerWidth - 280),
      y: Math.max(240, e.clientY - 40),
      data: {
        ...dataset,
        speed: point.speed,
        range: point.range,
        kw: point.kw,
      },
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartWrapper}>
        <h2>Range / Speed / Power</h2>
        <svg viewBox={`0 0 ${dim[0]} ${dim[1]}`}>
          {/* <defs>
            <pattern
              id="chart-grid"
              width="20"
              height="20"
              x={margin.left}
              y={margin.top}
              patternUnits="userSpaceOnUse"
            >
              <rect width="20" height="20" fill="white" />
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#eeeeee"
                strokeWidth="1"
              />
            </pattern>
          </defs> */}
          {/* <rect
            x={margin.left}
            y={margin.top}
            width={chartWidth}
            height={chartHeight}
            fill="url(#chart-grid)"
          ></rect> */}

          {xTicks.map((tick) => (
            <g key={`x-${tick}`} className={styles.tick}>
              <line
                x1={xScale(tick)}
                y1={margin.top}
                x2={xScale(tick)}
                y2={dim[1] - margin.bottom}
                strokeWidth="1"
              />
              <text
                x={xScale(tick)}
                y={dim[1] - margin.bottom + 24}
                textAnchor={tick === 5 ? "start" : "middle"}
                fill="#000"
                style={{ textTransform: "uppercase" }}
              >
                {tick}
                {tick === xTicks[xTicks.length - 1] ? " knots" : ""}
              </text>
            </g>
          ))}

          {kwTicks.map((tick) => (
            <g key={`kw-${tick.speed}`}>
              <text
                x={xScale(tick.speed)}
                y={margin.top - 10}
                textAnchor="middle"
                fill="#aeaeae"
              >
                {tick.kw}
                {tick.speed === 10 ? " kW" : ""}
              </text>
            </g>
          ))}

          <text
            x={margin.left + chartWidth / 2}
            y={dim[1] - margin.bottom + 40}
            textAnchor="middle"
            fontWeight="400"
            style={{ textTransform: "uppercase" }}
            fill="#000"
          >
            Speed
          </text>

          {yTicks.map((tick) => (
            <g key={`y-${tick}`} className={styles.tick}>
              <line
                x1={margin.left}
                y1={yScale(tick)}
                x2={dim[0] - margin.right}
                y2={yScale(tick)}
                strokeWidth="1"
              />
              <text
                x={margin.left - 12}
                y={yScale(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontWeight="400"
                style={{ textTransform: "uppercase" }}
              >
                {tick}
                {tick === yTicks[yTicks.length - 1] ? " NM" : ""}
              </text>
            </g>
          ))}

          {/* Axes */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={dim[1] - margin.bottom}
            stroke="#000"
            strokeWidth="1"
          />

          <line
            x1={margin.left}
            y1={dim[1] - margin.bottom}
            x2={dim[0] - margin.right}
            y2={dim[1] - margin.bottom}
            stroke="#000"
            strokeWidth="1"
          />

          <text
            x={-(dim[1] - margin.bottom - margin.top) / 2}
            y={20}
            textAnchor="middle"
            fontWeight="400"
            style={{ textTransform: "uppercase" }}
            transform={`rotate(-90)`}
          >
            Weekly Range
          </text>

          <path
            d={dataToPath(allData.battery.values)}
            stroke="#000"
            fill="none"
            strokeDasharray={allData.battery.dashArray}
            strokeWidth="1"
          />
          <path
            d={dataToPath(allData["solar-winter"].values)}
            stroke="#000"
            fill="none"
            strokeDasharray={allData["solar-winter"].dashArray}
            strokeWidth="1"
          />
          <path
            d={dataToPath(allData["solar-summer"].values)}
            stroke="#000"
            fill="none"
            strokeDasharray={allData["solar-summer"].dashArray}
            strokeWidth="1"
          />

          {Object.entries(allData).map(([key, dataset]) =>
            dataset.values.map((point, i) => (
              <g key={`${key}-${i}`} className={styles.point}>
                <circle
                  cx={xScale(point.speed)}
                  cy={yScale(point.range)}
                  r="4.5"
                  strokeWidth={1}
                />
                <rect
                  x={xScale(point.speed) - 9}
                  y={yScale(point.range) - 9}
                  height="18"
                  width="18"
                  strokeWidth={1}
                  opacity={0}
                  onMouseEnter={(e) => handleMouseEnter(key, point, e)}
                  onMouseLeave={handleMouseLeave}
                />
              </g>
            )),
          )}

          <g transform={`translate(${margin.left}, ${dim[1] - 100})`}>
            <g>
              <line
                x1={0}
                y1={0}
                x2={30}
                y2={0}
                stroke="#000"
                strokeDasharray={allData["solar-summer"].dashArray}
                strokeWidth="1"
              />
              <text
                x={35}
                y={0}
                dominantBaseline="middle"
                fill="#000"
              >
                {allData["solar-summer"].label} ({allData["solar-summer"].kWh}{" "}
                kWh)
              </text>
            </g>

            <g transform={`translate(0, 30)`}>
              <line
                x1={0}
                y1={0}
                x2={30}
                y2={0}
                stroke="#000"
                strokeDasharray={allData.battery.dashArray}
                strokeWidth="1"
              />
              <text
                x={35}
                y={0}
                dominantBaseline="middle"
                fill="#000"
              >
                <tspan>{allData.battery.label}</tspan> ({allData["battery"].kWh}{" "}
                kWh)
              </text>
            </g>

            <g transform={`translate(0, 60)`}>
              <line
                x1={0}
                y1={0}
                x2={30}
                y2={0}
                stroke="#000"
                strokeDasharray={allData["solar-winter"].dashArray}
                strokeWidth="1"
              />
              <text
                x={35}
                y={0}
                dominantBaseline="middle"
                fill="#000"
              >
                {allData["solar-winter"].label} ({allData["solar-winter"].kWh}{" "}
                kWh)
              </text>
            </g>
          </g>
        </svg>

        {tooltip && (
          <div
            className={`${styles.materials} ${styles.tooltip}`}
            style={{
              left: tooltip.x + 10,
              top: tooltip.y + 10,
            }}
          >
            <div
              style={{
                gridTemplateColumns: "1fr",
              }}
            >
              <h6>
                <span style={{ fontWeight: 600 }}> {tooltip.data.label}</span>
                {tooltip.data.sublabel ? (
                  <span style={{ textTransform: "none" }}>
                    , {tooltip.data.sublabel}
                  </span>
                ) : (
                  <></>
                )}
              </h6>
            </div>
            <div>
              <h6>Speed </h6>
              <h6>{tooltip.data.speed} knots</h6>
            </div>
            <div>
              <h6>Range </h6>
              <h6>{tooltip.data.range} NM</h6>
            </div>
            <div>
              <h6>Power </h6>
              <h6>
                {tooltip.data.kw}{" "}
                <span style={{ textTransform: "none" }}>&nbsp;kW</span>
              </h6>
            </div>
            <div>
              <h6>Total capacity</h6>
              <h6>
                {tooltip.data.kWh}{" "}
                <span style={{ textTransform: "none" }}>&nbsp;kWh</span>
              </h6>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
