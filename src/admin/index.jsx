/**
 * Lean Forms Admin Entry Point
 * Single dashboard app with routing and state management
 */

import React from 'react';
import { render } from '@wordpress/element';
import Dashboard from './Dashboard';
import './store'; // Initialize store

console.log('🚀 Lean Forms Admin: Loading dashboard app');
console.log('📊 Available data:', window.leanFormsAdmin);

// Render the dashboard app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📱 DOM loaded, initializing dashboard...');
  
  // Check for both containers (backward compatibility)
  const entriesContainer = document.getElementById('lean-forms-app');
  const settingsContainer = document.getElementById('lean-forms-settings');
  
  // Render dashboard in either container
  const container = entriesContainer || settingsContainer;
  
  if (container) {
    console.log('✅ Container found, rendering dashboard');
    render(<Dashboard />, container);
  } else {
    console.error('❌ No container found for dashboard');
  }
});