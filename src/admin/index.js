/**
 * Lean Forms Admin Entry Point
 * Single application with routing and state management
 */

import React from 'react';
import { createRoot } from '@wordpress/element';
import App from './App';
import './store'; // Initialize store
import './app.scss'; // Import styles

console.log('🚀 Lean Forms Admin: Loading application');
console.log('📊 Available data:', window.leanFormsAdmin);

// Render the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📱 DOM loaded, initializing app...');
  
  // Check for both containers (backward compatibility)
  const entriesContainer = document.getElementById('lean-forms-app');
  const settingsContainer = document.getElementById('lean-forms-settings');
  
  // Render app in either container
  const container = entriesContainer || settingsContainer;
  
  if (container) {
    console.log('✅ Container found, rendering app');
    const root = createRoot(container);
    root.render(<App />);
  } else {
    console.error('❌ No container found for app');
  }
});