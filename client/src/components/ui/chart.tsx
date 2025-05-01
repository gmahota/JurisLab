import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import ApexCharts with SSR disabled
const ApexChart = dynamic(() => import("apexcharts/dist/apexcharts").then(() => import("react-apexcharts")), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md"></div>
});

interface ChartProps {
  type: "line" | "area" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap";
  height?: number;
  width?: number | string;
  options: any;
  series: any[];
  className?: string;
}

export function Chart({ type, height = 350, width = "100%", options, series, className }: ChartProps) {
  const [mounted, setMounted] = useState(false);

  // Only render the chart on the client side to avoid SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply dark mode theme to chart
  const chartOptions = {
    ...options,
    theme: {
      mode: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      ...options.theme
    },
    chart: {
      ...options.chart,
      background: 'transparent'
    },
    colors: options.colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  };

  return (
    <div className={`${className || ''}`}>
      {mounted && (
        <ApexChart
          type={type}
          height={height}
          width={width}
          options={chartOptions}
          series={series}
        />
      )}
    </div>
  );
}