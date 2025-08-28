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
import { LITE_ADDONS, PRO_ADDONS } from '../data/features';

const Features = ({ navigate }) => {
  const dispatch = useDispatch('lean-forms/admin');
  const [updating, setUpdating] = useState({});
  
  const { settings, settingsLoading } = useSelect((select) => ({
    settings: select('lean-forms/admin').getSettings(),
    settingsLoading: select('lean-forms/admin').isSettingsLoading(),
  }));

  // Set up API authentication
  useEffect(() => {
    apiFetch.use(apiFetch.createNonceMiddleware(window.leanFormsAdmin?.nonce || ''));
  }, []);

  const isFeatureEnabled = (feature) => {
    return settings[feature.option] || false;
  };

  const updateFeatureSetting = async (feature, value) => {
    if (!feature.option) {
      console.warn('Feature missing option field:', feature);
      return;
    }
    
    console.log('Updating feature setting:', { feature: feature.name, option: feature.option, value });
    setUpdating(prev => ({ ...prev, [feature.id]: true }));
    
    try {
      // Optimistically update the UI
      dispatch.updateSetting(feature.option, value);
      
      // Make API call
      console.log('Making API call to update setting...');
      const response = await apiFetch({
        path: '/lean-forms/v1/settings',
        method: 'POST',
        data: { [feature.option]: value },
      });
      
      console.log('API response:', response);
      
      // Show success toast
      showToast.success(
        response.message || __('Feature setting updated successfully!', 'lean-forms')
      );
      
    } catch (error) {
      console.error('Error updating feature setting:', error);
      
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

  // Combine all features
  const allFeatures = [
    ...LITE_ADDONS.map(feature => ({ ...feature, isPro: false })),
    ...PRO_ADDONS.map(feature => ({ ...feature, isPro: true }))
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
            isPro={feature.isPro}
          />
        ))}
      </div>
    </div>
  );
};

export default Features;
