import React from "react";

export default function TrendChart({
  registry,
  activePatientId,
  activePatientName,
  currentScanResult,
}) {
  // 1. Gather all historical records for this patient from the registry
  let patientHistory = registry
    .filter((record) => record.id === activePatientId)
    .map((record) => ({
      date: record.date || "Prior Visit",
      count: record.count,
    }));

  // 2. If there is an active unsaved scan result on the screen, append it to show the real-time trend
  if (currentScanResult) {
    patientHistory = [
      { date: "Current Scan", count: currentScanResult.count },
      ...patientHistory,
    ];
  }

  // Reverse history so it reads left-to-right (chronological order)
  const sortedHistory = [...patientHistory].reverse();

  // 3. Setup dimensions for our SVG chart
  const svgWidth = 450;
  const svgHeight = 160;
  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // 4. Calculate coordinate boundaries
  const maxCount = Math.max(...sortedHistory.map((d) => d.count), 5); // Default min peak to 5 for aesthetics

  // Generate coordinate points for SVG line mapping
  const points = sortedHistory.map((data, index) => {
    const x =
      paddingLeft + (index / (sortedHistory.length - 1 || 1)) * chartWidth;
    const y = paddingTop + chartHeight - (data.count / maxCount) * chartHeight;
    return { x, y, val: data.count, label: data.date };
  });

  // Create SVG path string
  const linePath =
    points.length > 1
      ? points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
      : "";

  // Create smooth filled area path under the line
  const areaPath =
    points.length > 1
      ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
      : "";

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4 transition-colors duration-200">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">
            Parasite Density Tracking
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Historical trend for {activePatientName}
          </p>
        </div>
        <span className="text-[10px] bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 font-bold px-2 py-0.5 rounded border border-cyan-100 dark:border-cyan-500/10">
          Timeline view
        </span>
      </div>

      {sortedHistory.length < 2 ? (
        /* Baseline State: Appears when a patient has only 1 recorded scan */
        <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500">
          <span className="text-2xl block mb-2">📈</span>
          <p className="font-medium">Baseline Scan Registered</p>
          <p className="text-[10px] text-slate-400 mt-1">
            Subsequent scans for Patient ID{" "}
            <span className="font-mono text-cyan-500">{activePatientId}</span>{" "}
            will generate a clinical tracking trend.
          </p>
        </div>
      ) : (
        /* Active Trend State: Beautiful responsive SVG chart */
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            {/* Horizontal Grid lines */}
            {[0, 0.5, 1].map((ratio, i) => {
              const y = paddingTop + ratio * chartHeight;
              const value = Math.round(maxCount * (1 - ratio));
              return (
                <g key={i} className="opacity-40">
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3}
                    className="text-[9px] fill-slate-400 dark:fill-slate-500 text-right font-mono"
                    textAnchor="end"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {/* Gradient fill under the curve */}
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.00" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#areaGrad)" />

            {/* Main Trend Line */}
            <path
              d={linePath}
              fill="none"
              className="stroke-cyan-500"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Nodes */}
            {points.map((p, i) => (
              <g key={i} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  className="fill-cyan-500 stroke-white dark:stroke-slate-950"
                  strokeWidth="1.5"
                />

                {/* Micro Tooltip on hover/node */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="9"
                  className="fill-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                />

                {/* Floating Count over Node */}
                <text
                  x={p.x}
                  y={p.y - 10}
                  className="text-[9px] font-bold fill-slate-700 dark:fill-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-center"
                  textAnchor="middle"
                >
                  {p.val} Cells
                </text>

                {/* X Axis Labels */}
                <text
                  x={p.x}
                  y={svgHeight - 10}
                  className="text-[9px] fill-slate-400 dark:fill-slate-500 font-medium"
                  textAnchor="middle"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}
