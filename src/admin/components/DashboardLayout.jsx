/**
 * Dashboard Layout Component
 * Main layout with header navigation
 */

import React from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
  Card,
  CardBody,
  Notice,
  Button,
  Icon,
  TabPanel,
  Flex,
  FlexItem,
} from '@wordpress/components';

// Icons
import { 
  home as dashboardIcon,
  list as listIcon, 
  cog as cogIcon,
  help as helpIcon,
  external as externalIcon
} from '@wordpress/icons';

const DashboardLayout = ({ children, currentPath, navigate }) => {
  const dispatch = useDispatch('lean-forms/admin');
  
  const { notices } = useSelect((select) => ({
    notices: select('lean-forms/admin').getNotices(),
  }));

  const navigationTabs = [
    {
      name: 'dashboard',
      title: __('Dashboard', 'lean-forms'),
      icon: dashboardIcon,
    },
    {
      name: 'entries',
      title: __('Entries', 'lean-forms'),
      icon: listIcon,
    },
    {
      name: 'addons',
      title: __('Add-ons', 'lean-forms'),
      icon: cogIcon,
    },
  ];

  const handleTabSelect = (tabName) => {
    navigate(tabName);
  };

  return (
    <div className="lean-forms-app">
      <div className="dashboard-header bg-white h-16 px-5">
        <Flex justify="space-between" align="center" style={{ minHeight: '60px' }}>
          <FlexItem>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-gray-900 m-0">
                {__('Lean Forms', 'lean-forms')}
              </h1>
              <span className="text-sm">
                {__('Power-Ups for Contact Form 7', 'lean-forms')}
              </span>
            </div>
          </FlexItem>

          <FlexItem>
            <div className="flex items-center space-x-2">
              <Button
                variant="tertiary"
                href="https://plugpress.io/lean-forms/docs"
                target="_blank"
                style={{
                  padding: '8px 12px',
                  height: '40px',
                  color: '#646970'
                }}
              >
                <div className="flex items-center space-x-2">
                  <Icon icon={helpIcon} size={16} />
                  <span>{__('Docs', 'lean-forms')}</span>
                  <Icon icon={externalIcon} size={14} />
                </div>
              </Button>
            </div>
          </FlexItem>
        </Flex>
      </div>

      <div className="dashboard-content" style={{ 
        minHeight: 'calc(100vh - 92px)',
        backgroundColor: '#f0f0f1'
      }}>
        {/* Notices - Full Width */}
        {notices.length > 0 && (
          <div style={{ padding: '20px 20px 0' }}>
            <div className="max-w-7xl mx-auto">
              <div className="space-y-3">
                {notices.map((notice) => (
                  <Notice
                    key={notice.id}
                    status={notice.type}
                    onRemove={() => dispatch.removeNotice(notice.id)}
                    isDismissible
                  >
                    {notice.message}
                  </Notice>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Page Content - Constrained Width */}
        <div className="page-content">
          <div className={`mx-auto ${currentPath === 'entries' ? 'max-w-none px-0 pt-5' : 'max-w-7xl px-6 py-6'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
