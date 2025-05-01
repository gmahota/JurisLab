import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartProps {
  type: 
    | "line" 
    | "area" 
    | "bar" 
    | "pie" 
    | "donut" 
    | "radialBar" 
    | "scatter" 
    | "bubble" 
    | "heatmap" 
    | "candlestick" 
    | "boxPlot" 
    | "radar" 
    | "polarArea" 
    | "rangeBar" 
    | "rangeArea" 
    | "treemap";
  height: number;
  options: any;
  series: any[];
}

export function Chart({ type, height, options, series }: ChartProps) {
  // Using a state to ensure client-side only rendering
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a placeholder with the same dimensions
    return (
      <div 
        className="flex items-center justify-center bg-secondary/30" 
        style={{ height: `${height}px` }}
      >
        <p className="text-muted-foreground text-sm">Loading chart...</p>
      </div>
    );
  }

  return (
    <ReactApexChart
      type={type}
      height={height}
      options={options}
      series={series}
    />
  );
}