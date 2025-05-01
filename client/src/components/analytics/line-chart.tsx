import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface LineChartProps {
  data: any[];
  xDataKey: string;
  lines: Array<{
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
  }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
  height?: number;
}

export function LineChart({
  data,
  xDataKey,
  lines,
  xAxisLabel,
  yAxisLabel,
  className,
  height = 300
}: LineChartProps) {
  return (
    <div className={`w-full ${className}`} style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
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
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              activeDot={{ r: 8 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}