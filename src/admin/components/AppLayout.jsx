/**
 * App Layout Component
 * Main application layout with header navigation and content area
 */

import React from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Home, List, Settings, HelpCircle, ExternalLink, Plus } from 'lucide-react';

// UI Components
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from './lib/utils';

const AppLayout = ({ children, currentPath, navigate }) => {
  const dispatch = useDispatch('lean-forms/admin');
  
  const { notices } = useSelect((select) => ({
    notices: select('lean-forms/admin').getNotices(),
  }));

  const navigationItems = [
    {
      name: 'dashboard',
      title: __('Dashboard', 'lean-forms'),
      icon: Home,
    },
    {
      name: 'add-form',
      title: __('Add Form', 'lean-forms'),
      icon: Plus,
    },
    {
      name: 'entries',
      title: __('Entries', 'lean-forms'),
      icon: List,
    },
    {
      name: 'features',
      title: __('Features', 'lean-forms'),
      icon: Settings,
    },
  ];

  const dismissNotice = (id) => {
    dispatch.removeNotice(id);
  };

  const handleNavigation = (path) => {
    console.log('🚀 AppLayout navigating to:', path);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  {__('Lean Forms', 'lean-forms')}
                </h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.name;
                
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.name)}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </button>
                );
              })}
            </nav>

            {/* Help & Docs */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://plugpress.io/lean-forms/docs', '_blank')}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                {__('Help', 'lean-forms')}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Notices */}
      {notices.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={cn(
                  "flex items-center justify-between py-3 px-4 rounded-md my-2",
                  notice.type === 'error' 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <span>{notice.message}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissNotice(notice.id)}
                  className="text-current hover:bg-current/10"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex flex-1 flex-col w-full max-w-[1280px] mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
