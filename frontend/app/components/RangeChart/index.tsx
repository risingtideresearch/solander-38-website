"use client";

export default function RangeChart() {
  const dim = [700, 700];
  const margin = { top: 20, right: 119, bottom: 179, left: 80 };
  const chartWidth = dim[0] - margin.left - margin.right;
  const chartHeight = dim[1] - margin.top - margin.bottom;

  const allData = {
    battery: {
      key: "no-solar",
      label: "Full battery / no solar",
      dashArray: "",
      values: Array.from({ length: 51 }, (_, i) => {
        const speed = 5 + i * 0.1; // 5.0 to 10.0 in 0.1 increments
        // Exponential decay: efficiency drops exponentially as speed increases
        const range = 110 + 70 * Math.exp(-0.4 * (speed - 5));
        return {
          speed: parseFloat(speed.toFixed(1)),
          range: range,
        };
      }),
    },
    "solar-winter": {
      key: "solar-pnw-winter",
      label: "Weekly Using solar / PNW winter",
      dashArray: "2 10",
      values: Array.from({ length: 51 }, (_, i) => {
        const speed = 5 + i * 0.1;
        // Steeper exponential decay
        const range = 80 + 50 * Math.exp(-0.35 * (speed - 5));
        return {
          speed: parseFloat(speed.toFixed(1)),
          range: range,
        };
      }),
    },
    "solar-summer": {
      key: "solar-pnw-summer",
      label: "Weekly Using solar / PNW summer",
      dashArray: "5 5",
      values: Array.from({ length: 51 }, (_, i) => {
        const speed = 5 + i * 0.1;
        // Gentler exponential decay
        const range = 120 + 120 * Math.exp(-0.3 * (speed - 5));
        return {
          speed: parseFloat(speed.toFixed(1)),
          range: range,
        };
      }),
    },
  };

  // Scaling functions
  const xScale = (speed: number) => {
    const minSpeed = 10;
    const maxSpeed = 5;
    return (
      margin.left + ((maxSpeed - speed) / (maxSpeed - minSpeed)) * chartWidth
    );
  };

  const yScale = (range: number) => {
    const minRange = 0;
    const maxRange = 250;
    return (
      dim[1] -
      margin.bottom -
      ((range - minRange) / (maxRange - minRange)) * chartHeight
    );
  };

  const dataToPath = (values: Array<{ speed: number; range: number }>) => {
    return values
      .map((point, i) => {
        const x = xScale(point.speed);
        const y = yScale(point.range);
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(" ");
  };

  const xTicks = [5, 6, 7, 8, 9, 10];
  const yTicks = [0, 50, 100, 150, 200, 250];

  return (
    <div style={{ padding: "6rem 0" }}>
      <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span>
            <img
              style={{
                display: "inline-block",
                width: "100px",
                height: "auto",
              }}
              src="/images/solander-38.png"
            />
          </span>
          <h2 style={{ margin: 0 }}>Solander 38 Range vs Speed</h2>
        </div>
        <svg
          style={{ width: "100%", height: "auto" }}
          viewBox={`0 0 ${dim[0]} ${dim[1]}`}
        >
          <defs>
            <pattern
              id="chart-grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect width="20" height="20" fill="var(--background)" />
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#e6e6e6"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect
            x={margin.left}
            y={margin.top}
            width={chartWidth}
            height={chartHeight}
            fill="url(#chart-grid)"
          ></rect>

          {/* X Axis Ticks and Labels */}
          {xTicks.map((tick) => (
            <g key={`x-${tick}`}>
              <line
                x1={xScale(tick)}
                y1={margin.top}
                x2={xScale(tick)}
                y2={dim[1] - margin.bottom}
                stroke="#d2d2d2"
                strokeWidth="1"
              />
              <text
                x={xScale(tick)}
                y={dim[1] - margin.bottom + 24}
                textAnchor={tick == 5 ? "start" : "middle"}
                fontSize="14"
                fill="#000"
                style={{ textTransform: "uppercase" }}
              >
                {tick}
                {tick == 5 ? " knots" : ""}
              </text>
            </g>
          ))}

          {/* X Axis Label */}
          <text
            x={margin.left + chartWidth / 2}
            y={dim[1] - margin.bottom + 40}
            textAnchor="middle"
            fontSize="14"
            fontWeight="400"
            style={{ textTransform: "uppercase" }}
            fill="#000"
          >
            Speed
          </text>

          {/* Y Axis */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={dim[1] - margin.bottom}
            stroke="#000"
            strokeWidth="1"
          />

          {/* Y Axis Ticks and Labels */}
          {yTicks.map((tick) => (
            <g key={`y-${tick}`}>
              <line
                x1={margin.left}
                y1={yScale(tick)}
                x2={dim[0] - margin.right}
                y2={yScale(tick)}
                stroke="#d2d2d2"
                strokeWidth="1"
              />
              <text
                x={margin.left - 12}
                y={yScale(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="400"
                style={{ textTransform: "uppercase" }}
              >
                {tick}
                {tick == 250 ? " NM" : ""}
              </text>
            </g>
          ))}
          {/* X Axis */}
          <line
            x1={margin.left}
            y1={dim[1] - margin.bottom}
            x2={dim[0] - margin.right}
            y2={dim[1] - margin.bottom}
            stroke="#000"
            strokeWidth="1"
          />

          {/* Y Axis Label */}
          <text
            x={-(dim[1] - margin.bottom - margin.top) / 2}
            y={20}
            textAnchor="middle"
            fontSize="14"
            fontWeight="400"
            style={{ textTransform: "uppercase" }}
            transform={`rotate(-90)`}
          >
            Range
          </text>

          {/* Grid Lines */}
          {/* {yTicks.map((tick) => (
            <line
              key={`grid-${tick}`}
              x1={margin.left}
              y1={yScale(tick)}
              x2={dim[0] - margin.right}
              y2={yScale(tick)}
              stroke="#e8e8e8ff"
              strokeWidth="1"
            />
          ))} */}

          {/* All Three Lines */}
          <path
            d={dataToPath(allData.battery.values)}
            stroke="#000"
            fill="none"
            strokeDasharray={allData.battery.dashArray}
            strokeWidth="2"
          />
          <path
            d={dataToPath(allData["solar-winter"].values)}
            stroke="#000"
            fill="none"
            strokeDasharray={allData["solar-winter"].dashArray}
            strokeWidth="2"
          />
          <path
            d={dataToPath(allData["solar-summer"].values)}
            stroke="#000"
            fill="none"
            strokeDasharray={allData["solar-summer"].dashArray}
            strokeWidth="2"
          />

          {/* Annotation */}
          {/* <g
            transform={`translate(${xScale(allData["solar-summer"].values[0].speed)}, ${yScale(allData["solar-summer"].values[0].range)})`}
          >
            <circle r={10} stroke="#000" fill="none"></circle>

            <line stroke="#000" x1={10} x2={30} y1={0} y2={0}></line>

            <text transform="translate(35, 5)">Maximum weekly range</text>
          </g> */}

          {/* Legend */}
          <g transform={`translate(${margin.left}, ${dim[1] - 100})`}>
            <g>
              <line
                x1={0}
                y1={0}
                x2={30}
                y2={0}
                stroke="#000"
                strokeDasharray={allData.battery.dashArray}
                strokeWidth="2"
              />
              <text
                x={35}
                y={0}
                dominantBaseline="middle"
                fontSize="14"
                fill="#000"
              >
                {allData.battery.label}
              </text>
            </g>

            <g transform={`translate(0, 30)`}>
              <line
                x1={0}
                y1={0}
                x2={30}
                y2={0}
                stroke="#000"
                strokeDasharray={allData["solar-summer"].dashArray}
                strokeWidth="2"
              />
              <text
                x={35}
                y={0}
                dominantBaseline="middle"
                fontSize="14"
                fill="#000"
              >
                {allData["solar-summer"].label}
              </text>
            </g>

            <g transform={`translate(0, 75)`}>
              <line
                x1={0}
                y1={0}
                x2={30}
                y2={0}
                stroke="#000"
                strokeDasharray={allData["solar-winter"].dashArray}
                strokeWidth="2"
              />
              <text
                x={35}
                y={0}
                dominantBaseline="middle"
                fontSize="14"
                fill="#000"
              >
                {allData["solar-winter"].label}
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
