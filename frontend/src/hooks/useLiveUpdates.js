import { useEffect } from 'react';
import { WebSocketClient } from '../services/websocket';
import { useDashboard } from '../context/DashboardContext';

export const useLiveUpdates = (url) => {
  const { handleLiveUpdate } = useDashboard();

  useEffect(() => {
    const wsClient = new WebSocketClient(url, handleLiveUpdate);
    wsClient.connect();

    return () => {
      wsClient.disconnect();
    };
  }, [url, handleLiveUpdate]);
};
