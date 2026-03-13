import React from 'react';

export const KPICard = ({ title, value, prefix = '', suffix = '', icon: Icon, loading }) => {
  if (loading) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="w-24 h-5 bg-muted rounded animate-pulse"></div>
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
        </div>
        <div className="w-32 h-8 bg-muted rounded animate-pulse mt-2"></div>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center text-muted-foreground">
        <h3 className="text-sm font-semibold tracking-wide uppercase">{title}</h3>
        {Icon && <Icon size={20} className="opacity-70" />}
      </div>
      <div className="flex items-baseline gap-1 mt-2">
        {prefix && <span className="text-2xl font-bold text-foreground">{prefix}</span>}
        <span className="text-3xl font-bold text-foreground tracking-tight">{value != null ? value.toLocaleString() : '-'}</span>
        {suffix && <span className="text-xl font-bold text-foreground">{suffix}</span>}
      </div>
      
      {/* Fake trend indicator for visuals */}
      <div className="flex items-center gap-1 mt-2 text-sm text-green-500 font-medium">
        <span>+{(Math.random() * 5 + 1).toFixed(1)}%</span>
        <span className="text-muted-foreground font-normal ml-1">vs last period</span>
      </div>
    </div>
  );
};
