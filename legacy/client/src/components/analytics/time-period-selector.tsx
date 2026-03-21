import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface TimePeriodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

export function TimePeriodSelector({
  value,
  onChange,
  className,
  options = [
    { value: 'week', label: 'Past Week' },
    { value: 'month', label: 'Past Month' },
    { value: 'year', label: 'Past Year' },
    { value: 'all', label: 'All Time' },
  ]
}: TimePeriodSelectorProps) {
  return (
    <div className={`${className}`}>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Select timeframe" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}