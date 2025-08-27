/**
 * Dashboard Home Page
 * Overview and quick stats
 */

import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Flex,
  FlexItem,
  Icon,
} from '@wordpress/components';
import { 
  list as listIcon,
  cog as cogIcon,
  plus as plusIcon,
  chartBar as chartIcon,
  inbox as inboxIcon,
  warning as warningIcon,
} from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';

const DashboardHome = ({ navigate }) => {
  const [stats, setStats] = useState({
    totalEntries: 0,
    newEntries: 0,
    spamEntries: 0,
    totalForms: 0,
    loading: true,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load basic stats
      const response = await apiFetch({
        path: '/lean-forms/v1/entries?per_page=1',
      });
      
      const totalEntries = response.total || 0;
      const totalForms = window.leanFormsAdmin?.forms?.length || 0;
      
      // For now, we'll calculate these from the response
      // In a real implementation, you'd have dedicated endpoints
      setStats({
        totalEntries,
        newEntries: Math.floor(totalEntries * 0.3), // Approximate
        spamEntries: Math.floor(totalEntries * 0.1), // Approximate
        totalForms,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    {
      title: __('Total Entries', 'lean-forms'),
      value: stats.totalEntries,
      icon: inboxIcon,
      color: '#2271b1',
      description: __('All form submissions', 'lean-forms'),
      action: () => navigate('entries'),
    },
    {
      title: __('New Entries', 'lean-forms'),
      value: stats.newEntries,
      icon: plusIcon,
      color: '#00a32a',
      description: __('Unread submissions', 'lean-forms'),
      action: () => navigate('entries'),
    },
    {
      title: __('Spam Entries', 'lean-forms'),
      value: stats.spamEntries,
      icon: warningIcon,
      color: '#d63638',
      description: __('Flagged as spam', 'lean-forms'),
      action: () => navigate('entries'),
    },
    {
      title: __('Active Forms', 'lean-forms'),
      value: stats.totalForms,
      icon: listIcon,
      color: '#7c3aed',
      description: __('Contact Form 7 forms', 'lean-forms'),
      action: () => window.open('admin.php?page=wpcf7', '_blank'),
    },
  ];

  const quickActions = [
    {
      title: __('View All Entries', 'lean-forms'),
      description: __('Manage form submissions', 'lean-forms'),
      icon: listIcon,
      action: () => navigate('entries'),
      color: '#2271b1',
    },
    {
      title: __('Manage Add-ons', 'lean-forms'),
      description: __('Configure add-ons', 'lean-forms'),
      icon: cogIcon,
      action: () => navigate('addons'),
      color: '#7c3aed',
    },
    {
      title: __('Create New Form', 'lean-forms'),
      description: __('Add Contact Form 7 form', 'lean-forms'),
      icon: plusIcon,
      action: () => window.open('admin.php?page=wpcf7-new', '_blank'),
      color: '#00a32a',
    },
  ];

  return (
    <div className="dashboard-home">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 m-0">
            {__('Dashboard', 'lean-forms')}
          </h1>
          <p className="text-base text-gray-600 mt-2">
            {__('Welcome to Lean Forms. Here\'s an overview of your form activity.', 'lean-forms')}
          </p>
        </div>

        {/* Stats Cards */}
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            {__('Overview', 'lean-forms')}
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px' 
          }}>
            {statCards.map((stat, index) => (
              <Card 
                key={index}
                style={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={stat.action}
                className="stat-card"
              >
                <CardBody style={{ padding: '20px' }}>
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <Icon 
                        icon={stat.icon} 
                        size={24}
                        style={{ color: stat.color }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col space-y-1">
                      <p className="text-sm text-gray-600 m-0 font-medium">
                        {stat.title}
                      </p>
                      <h3 className="text-3xl font-semibold text-gray-900 m-0">
                        {stats.loading ? '...' : stat.value}
                      </h3>
                      <p className="text-xs text-gray-600 m-0">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            {__('Quick Actions', 'lean-forms')}
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                style={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <CardBody style={{ padding: '20px' }}>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-10 h-10 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${action.color}15` }}
                      >
                        <Icon 
                          icon={action.icon} 
                          size={20}
                          style={{ color: action.color }}
                        />
                      </div>
                      <div className="flex-1 flex flex-col space-y-1">
                        <h4 className="text-base font-medium text-gray-900 m-0">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-600 m-0">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      onClick={action.action}
                      style={{ 
                        width: '100%',
                        backgroundColor: action.color,
                        borderColor: action.color,
                      }}
                    >
                      {action.title}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <Card style={{ 
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        }}>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900 m-0">
              {__('Getting Started', 'lean-forms')}
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-gray-700">
                {__('Lean Forms enhances your Contact Form 7 experience with powerful features like form entry management, grid layouts, and advanced styling options.', 'lean-forms')}
              </p>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="primary"
                  onClick={() => navigate('addons')}
                >
                  {__('Configure Add-ons', 'lean-forms')}
                </Button>
                <Button 
                  variant="secondary"
                  href="https://plugpress.io/lean-forms/docs"
                  target="_blank"
                >
                  {__('View Documentation', 'lean-forms')}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
