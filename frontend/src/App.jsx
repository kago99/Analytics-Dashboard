import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardProvider } from './context/DashboardContext';
import { Layout } from './components/Layout';

// Lazy load the Dashboard component for performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

const FallbackPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center h-full">
    <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
    <p className="text-muted-foreground">This page is under construction for the demo. Please view the Overview page.</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <DashboardProvider>
        <Router>
          <Layout>
            <Suspense fallback={
              <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/traffic" element={<FallbackPage title="Traffic Details" />} />
                <Route path="/sales" element={<FallbackPage title="Sales Details" />} />
                <Route path="/users" element={<FallbackPage title="Users Directory" />} />
                <Route path="/settings" element={<FallbackPage title="System Settings" />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default App;
