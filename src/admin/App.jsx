/**
 * Main Application Component
 * Single app with routing and state management
 */

import React, { useEffect, useState } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

// Layout
import AppLayout from './components/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import AddForm from './pages/AddForm';
import Entries from './pages/Entries';
import Features from './pages/Features';

// UI Components
import { Toast } from './components/ui/toast';

// Set up API authentication
apiFetch.use(apiFetch.createNonceMiddleware(window.leanFormsAdmin?.nonce || ''));

const App = () => {
  const dispatch = useDispatch('lean-forms/admin');
  const [currentPath, setCurrentPath] = useState('dashboard');
  
  // Initialize data on mount and handle hash routing
  useEffect(() => {
    // Set forms data from localized script
    if (window.leanFormsAdmin?.forms) {
      dispatch.setForms(window.leanFormsAdmin.forms);
    }
    
    // Parse current path from URL hash
    const parseHashPath = () => {
      const hash = window.location.hash;
      let path = hash.replace('#/', '').split('/')[0];
      
      // If no path or empty, default to dashboard
      if (!path || path === '') {
        path = 'dashboard';
      }
      
      console.log('🔍 Hash parsing:', { hash, path });
      return path;
    };

    const updatePath = () => {
      const path = parseHashPath();
      setCurrentPath(path);
      dispatch.setCurrentView(path);
    };

    // Set initial path
    updatePath();

    // Listen for hash changes
    const handleHashChange = () => {
      console.log('🔄 Hash changed:', window.location.hash);
      updatePath();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [dispatch]);

  // Load settings on mount
  useEffect(() => {
    dispatch.fetchSettings();
  }, [dispatch]);

  const navigate = (path) => {
    console.log('🚀 App navigating to:', path);
    if (path !== currentPath) {
      window.location.hash = `#/${path}`;
    }
  };

  // Render current page component
  const renderCurrentPage = () => {
    console.log('🎯 Rendering page for path:', currentPath);
    
    switch (currentPath) {
      case 'add-form':
        console.log('➕ Rendering AddForm');
        return <AddForm navigate={navigate} />;
      case 'entries':
        console.log('📋 Rendering Entries');
        return <Entries navigate={navigate} />;
      case 'addons':
      case 'features':
        console.log('🔧 Rendering Features');
        return <Features navigate={navigate} />;
      case 'dashboard':
        console.log('🏠 Rendering Dashboard');
        return <Dashboard navigate={navigate} />;
      default:
        console.log('❓ Unknown path, rendering Dashboard');
        return <Dashboard navigate={navigate} />;
    }
  };

  return (
    <>
      <AppLayout currentPath={currentPath} navigate={navigate}>
        {renderCurrentPage()}
      </AppLayout>
      <Toast />
    </>
  );
};

export default App;
