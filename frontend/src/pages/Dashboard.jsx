import React, { Suspense } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useLiveUpdates } from '../hooks/useLiveUpdates';
import { KPICard } from '../components/KPICard';
import { TimeRangeFilter } from '../components/TimeRangeFilter';
import { Users, DollarSign, MousePointerClick, Activity } from 'lucide-react';

const TrafficLineChart = React.lazy(() => import('../charts/TrafficLineChart'));
const SalesBarChart = React.lazy(() => import('../charts/SalesBarChart'));
const TrafficPieChart = React.lazy(() => import('../charts/TrafficPieChart'));
const UserGrowthAreaChart = React.lazy(() => import('../charts/UserGrowthAreaChart'));

const SkeletonChart = () => (
  <div className="bg-card p-6 rounded-xl border border-border h-[400px] flex items-center justify-center animate-pulse">
    <div className="text-muted-foreground font-medium">Loading Chart...</div>
  </div>
);

export const Dashboard = () => {
  const { metrics, loading, error, trafficData, salesData, usersData } = useDashboard();
  
  // Establish WebSocket connection for real-time updates
  useLiveUpdates('ws://localhost:8000/ws/live');

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl max-w-md border border-red-500/20">
          <h2 className="text-lg font-bold mb-2">Error Loading Dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time metrics and dynamic system performance.</p>
        </div>
        <TimeRangeFilter />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Active Users" 
          value={metrics?.activeUsers} 
          icon={Users} 
          loading={loading && !metrics} 
        />
        <KPICard 
          title="Revenue" 
          value={metrics?.revenue} 
          prefix="$" 
          icon={DollarSign} 
          loading={loading && !metrics} 
        />
        <KPICard 
          title="Conversion Rate" 
          value={metrics?.conversionRate} 
          suffix="%" 
          icon={MousePointerClick} 
          loading={loading && !metrics} 
        />
        <KPICard 
          title="Traffic Sources" 
          value={metrics?.trafficSources} 
          icon={Activity} 
          loading={loading && !metrics} 
        />
      </div>

      <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><SkeletonChart/><SkeletonChart/><SkeletonChart/><SkeletonChart/></div>}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <TrafficLineChart data={trafficData} />
          <SalesBarChart data={salesData} />
          <TrafficPieChart data={trafficData} />
          <UserGrowthAreaChart data={usersData} />
        </div>
      </Suspense>
    </div>
  );
};

export default Dashboard;
