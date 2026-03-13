import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchMetrics, fetchTraffic, fetchSales, fetchUsers } from '../services/api';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [timeRange, setTimeRange] = useState('7d'); // '24h', '7d', '30d'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data State
  const [metrics, setMetrics] = useState(null);
  const [trafficData, setTrafficData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  // Fetch initial data based on timeRange
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsRes, trafficRes, salesRes, usersRes] = await Promise.all([
        fetchMetrics(timeRange),
        fetchTraffic(timeRange),
        fetchSales(timeRange),
        fetchUsers(timeRange),
      ]);

      setMetrics(metricsRes.data[0] || null);
      
      // Reverse array to show oldest to newest left to right on charts
      setTrafficData([...trafficRes.data].reverse());
      setSalesData([...salesRes.data].reverse());
      setUsersData([...usersRes.data].reverse());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler for incoming WebSocket real-time updates
  const handleLiveUpdate = useCallback((liveData) => {
    // We get a payload structured as { timestamp, metrics: {...}, traffic: {...}, sales: {...}, users: {...} }
    const { timestamp, metrics: liveMetrics, traffic: liveTraffic, sales: liveSales, users: liveUsers } = liveData;

    // 1. Update KPI metrics immediately
    setMetrics({
      timestamp,
      ...liveMetrics
    });

    // 2. Append new data points to charts (keep maximum 30 points to avoid memory leaks)
    setTrafficData((prev) => {
      const newArr = [...prev, { timestamp, ...liveTraffic }];
      return newArr.length > 50 ? newArr.slice(newArr.length - 50) : newArr;
    });

    setSalesData((prev) => {
      const newArr = [...prev, { timestamp, ...liveSales }];
      return newArr.length > 50 ? newArr.slice(newArr.length - 50) : newArr;
    });

    setUsersData((prev) => {
      const newArr = [...prev, { timestamp, ...liveUsers }];
      return newArr.length > 50 ? newArr.slice(newArr.length - 50) : newArr;
    });
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        timeRange,
        setTimeRange,
        loading,
        error,
        metrics,
        trafficData,
        salesData,
        usersData,
        handleLiveUpdate,
        refreshData: loadData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
