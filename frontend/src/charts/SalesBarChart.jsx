import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export const SalesBarChart = ({ data }) => {
  const { isDarkMode } = useTheme();

  // Aggregate sales by product
  const aggregatedData = useMemo(() => {
    const map = new Map();
    data.forEach((d) => {
      const existing = map.get(d.product) || { product: d.product, amount: 0, quantity: 0 };
      existing.amount += d.amount;
      existing.quantity += d.quantity;
      map.set(d.product, existing);
    });
    
    // Convert to array and take top 7 products
    return Array.from(map.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 7)
      .map(item => ({...item, amount: Math.round(item.amount)}));
  }, [data]);

  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold mb-6 text-foreground">Sales per Product</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={aggregatedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={true} vertical={false} />
            <XAxis type="number" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="product" stroke={textColor} fontSize={11} tickLine={false} axisLine={false} width={100} />
            <Tooltip
              cursor={{ fill: gridColor, opacity: 0.4 }}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderColor: gridColor,
                color: isDarkMode ? '#f8fafc' : '#0f172a',
                borderRadius: '8px',
              }}
              formatter={(value) => [`$${value}`, 'Amount']}
            />
            <Bar dataKey="amount" fill="#8b5cf6" radius={[0, 4, 4, 0]} animationDuration={500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(SalesBarChart);
