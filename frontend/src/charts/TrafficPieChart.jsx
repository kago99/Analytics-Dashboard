import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const TrafficPieChart = ({ data }) => {
  const { isDarkMode } = useTheme();

  const aggregatedData = useMemo(() => {
    const map = new Map();
    data.forEach((d) => {
      const val = map.get(d.source) || 0;
      map.set(d.source, val + d.pageViews);
    });
    
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold mb-2 text-foreground">Traffic Sources</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={aggregatedData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
              animationDuration={500}
              stroke="transparent"
            >
              {aggregatedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderColor: gridColor,
                color: isDarkMode ? '#f8fafc' : '#0f172a',
                borderRadius: '8px',
              }}
              formatter={(value) => [value.toLocaleString(), 'Views']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value) => <span style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(TrafficPieChart);
