/**
 * Main Dashboard Component
 * Single app with routing and state management
 */

import React, { useEffect, useState } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

// Components
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import EntriesPage from './pages/EntriesPage';
import AddonsPage from './pages/AddonsPage';
import NotFoundPage from './pages/NotFoundPage';

// Set up API authentication
apiFetch.use(apiFetch.createNonceMiddleware(window.leanFormsAdmin?.nonce || ''));

const Dashboard = () => {
  const dispatch = useDispatch('lean-forms/admin');
  const [currentPath, setCurrentPath] = useState('dashboard');
  
  // Initialize data on mount
  useEffect(() => {
    // Set forms data from localized script
    if (window.leanFormsAdmin?.forms) {
      dispatch.setForms(window.leanFormsAdmin.forms);
    }
    
    // Get current path from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const path = urlParams.get('path') || 'dashboard';
    setCurrentPath(path);
    dispatch.setCurrentView(path);
    
    console.log('🚀 Lean Forms Dashboard initialized');
    console.log('📊 Available data:', window.leanFormsAdmin);
    console.log('🛤️ Current path:', path);
  }, [dispatch]);

  // Handle navigation
  const navigate = (path) => {
    setCurrentPath(path);
    dispatch.setCurrentView(path);
    
    // Update URL without page reload
    const newUrl = new URL(window.location);
    if (path === 'dashboard') {
      newUrl.searchParams.delete('path');
    } else {
      newUrl.searchParams.set('path', path);
    }
    window.history.pushState({}, '', newUrl);
  };

  // Render current page component
  const renderCurrentPage = () => {
    switch (currentPath) {
      case 'entries':
        return <EntriesPage navigate={navigate} />;
      case 'addons':
        return <AddonsPage navigate={navigate} />;
      case 'dashboard':
      default:
        return <DashboardHome navigate={navigate} />;
    }
  };

  return (
    <DashboardLayout currentPath={currentPath} navigate={navigate}>
      {renderCurrentPage()}
    </DashboardLayout>
  );
};

export default Dashboard;
