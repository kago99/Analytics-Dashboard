import React from 'react';
import { useDashboard } from '../context/DashboardContext';

export const TimeRangeFilter = () => {
  const { timeRange, setTimeRange } = useDashboard();
  const options = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
  ];

  return (
    <div className="flex bg-muted p-1 rounded-lg w-fit">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTimeRange(opt.value)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            timeRange === opt.value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
