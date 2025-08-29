/**
 * Features Management Page
 * Manage and configure plugin features
 */

import React, { useEffect, useState } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

// UI Components
import { Button } from '../components/ui/button';
import { showToast } from '../components/ui/toast';

// Components
import FeatureCard from '../components/FeatureCard';

// Data
import { LITE_features, PRO_features } from '../data/features';

const Features = ({ navigate }) => {
  const dispatch = useDispatch('lean-forms/admin');
  const [updating, setUpdating] = useState({});
  
  // Initialize Pro status from server-side data
  const [proStatus, setProStatus] = useState({
    installed: window.leanFormsAdmin?.proPlugin?.installed || false,
    licensed: false,
    loading: true
  });
  
  const { settings, settingsLoading } = useSelect((select) => ({
    settings: select('lean-forms/admin').getSettings(),
    settingsLoading: select('lean-forms/admin').isSettingsLoading(),
  }));

  // Set up API authentication, fetch settings and check pro status
  useEffect(() => {
    apiFetch.use(apiFetch.createNonceMiddleware(window.leanFormsAdmin?.nonce || ''));
    
    // Use server-side data if available
    if (window.leanFormsAdmin?.proPlugin?.installed) {
      setProStatus(prev => ({ ...prev, installed: true }));
    }
    
    // Fetch settings when component mounts
    dispatch.fetchSettings();
    
    checkProStatus();
  }, [dispatch]);

  // Check pro plugin installation and license status
  const checkProStatus = async () => {
    // Use server-side data as primary source
    const serverProInstalled = window.leanFormsAdmin?.proPlugin?.installed || false;
    
    if (serverProInstalled) {
      setProStatus(prev => ({ ...prev, installed: true }));
      
      // Get license status if Pro is installed
      try {
        const licenseResponse = await apiFetch({
          path: '/lean-forms-pro/v1/license',
          method: 'GET',
        });
        
        if (licenseResponse.success && licenseResponse.data) {
          setProStatus({
            installed: true,
            licensed: licenseResponse.data.status === 'active',
            loading: false
          });
        } else {
          setProStatus({
            installed: true,
            licensed: false,
            loading: false
          });
        }
      } catch (licenseError) {
        setProStatus({
          installed: true,
          licensed: false,
          loading: false
        });
      }
    } else {
      // Fallback: Try API detection
      try {
        await apiFetch({
          path: '/lean-forms-pro/v1/settings',
          method: 'GET',
        });
        setProStatus({
          installed: true,
          licensed: false,
          loading: false
        });
      } catch (error) {
        setProStatus({
          installed: false,
          licensed: false,
          loading: false
        });
      }
    }
  };

  const isFeatureEnabled = (feature) => {
    return settings[feature.option] || false;
  };

  const isFeatureDisabled = (feature) => {
    // Pro features are disabled if pro plugin is not installed or not licensed
    return feature.type === 'Pro' && (!proStatus.installed || !proStatus.licensed);
  };

  const updateFeatureSetting = async (feature, value) => {
    setUpdating(prev => ({ ...prev, [feature.id]: true }));
    
    try {
      // Optimistically update the UI
      dispatch.updateSetting(feature.option, value);
      
      const response = await dispatch.saveSettings({ [feature.option]: value });
      
      // Show success toast
      showToast.success(
        response.message || __('Feature setting updated successfully!', 'lean-forms')
      );
      
    } catch (error) {
      
      // Revert optimistic update
      dispatch.updateSetting(feature.option, !value);
      
      // Show error toast
      showToast.error(
        error.message || __('Failed to update feature setting. Please try again.', 'lean-forms')
      );
      
    } finally {
      setUpdating(prev => ({ ...prev, [feature.id]: false }));
    }
  };

  // Handle settings click
  const handleSettingsClick = (feature) => {
    navigate(`settings/${feature.id}`);
  };

  // Combine all features
  const allFeatures = [
    ...LITE_features.map(feature => ({ ...feature })),
    ...PRO_features.map(feature => ({ ...feature }))
  ];

  if (settingsLoading && Object.keys(settings).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">
          {__('Loading features...', 'lean-forms')}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">
          {__('Features', 'lean-forms')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {__('Enable or disable features for your forms.', 'lean-forms')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allFeatures.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            isEnabled={isFeatureEnabled(feature)}
            onToggle={(value) => updateFeatureSetting(feature, value)}
            isUpdating={updating[feature.id]}
            isPlanned={feature.isPlanned}
            isDisabled={isFeatureDisabled(feature)}
            proStatus={proStatus}
            onSettingsClick={handleSettingsClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Features;
