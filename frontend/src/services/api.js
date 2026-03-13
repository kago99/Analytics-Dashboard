import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchMetrics = async (range) => {
  const response = await apiClient.get(`/metrics?range=${range}&limit=1`);
  return response.data;
};

export const fetchTraffic = async (range) => {
  const response = await apiClient.get(`/traffic?range=${range}&limit=20`);
  return response.data;
};

export const fetchSales = async (range) => {
  const response = await apiClient.get(`/sales?range=${range}&limit=20`);
  return response.data;
};

export const fetchUsers = async (range) => {
  const response = await apiClient.get(`/users?range=${range}&limit=20`);
  return response.data;
};
