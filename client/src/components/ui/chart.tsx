import React from "react";
import dynamic from "next/dynamic";

// Dynamically import ApexCharts to avoid SSR issues
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartProps {
  type: "line" | "area" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap";
  height?: number;
  width?: number | string;
  options: any;
  series: any[];
  className?: string;
}

export function Chart({ type, height, width, options, series, className }: ChartProps) {
  return (
    <div className={`${className}`}>
      {typeof window !== "undefined" && (
        <ApexChart
          type={type}
          height={height}
          width={width}
          options={options}
          series={series}
        />
      )}
    </div>
  );
}