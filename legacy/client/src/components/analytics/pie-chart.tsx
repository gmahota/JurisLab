import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  nameKey?: string;
  dataKey?: string;
  colors?: string[];
  className?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
}

const DEFAULT_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0',
  '#FF6B6B', '#54C571', '#C2B280', '#4D4DFF', '#FFB6C1'
];

export function PieChart({
  data,
  nameKey = 'name',
  dataKey = 'value',
  colors = DEFAULT_COLORS,
  className,
  height = 300,
  innerRadius = 0,
  outerRadius = 80,
  paddingAngle = 2
}: PieChartProps) {
  return (
    <div className={`w-full ${className}`} style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            dataKey={dataKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [value, name]} 
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}