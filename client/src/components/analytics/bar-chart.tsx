import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface BarChartProps {
  data: any[];
  xDataKey: string;
  bars: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
  height?: number;
}

export function BarChart({
  data,
  xDataKey,
  bars,
  xAxisLabel,
  yAxisLabel,
  className,
  height = 300
}: BarChartProps) {
  return (
    <div className={`w-full ${className}`} style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xDataKey} 
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : undefined}
          />
          <YAxis
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', offset: -5 } : undefined}
          />
          <Tooltip />
          <Legend verticalAlign="top" />
          {bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}