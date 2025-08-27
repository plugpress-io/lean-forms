/**
 * Clean Minimalist Add-ons Page
 */

import React, { useEffect, useState } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Spinner, Snackbar } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

// Components
import AddonCard from '../components/AddonCard';

// Import add-on data
import { LITE_ADDONS, PRO_ADDONS } from '../data/features';

const AddonsPage = ({ navigate }) => {
  const dispatch = useDispatch('lean-forms/admin');
  const [updating, setUpdating] = useState({});
  const [notification, setNotification] = useState(null);
  
  const {
    settings,
    settingsLoading,
  } = useSelect((select) => ({
    settings: select('lean-forms/admin').getSettings(),
    settingsLoading: select('lean-forms/admin').isSettingsLoading(),
  }));

  // Set up API authentication
  useEffect(() => {
    apiFetch.use(apiFetch.createNonceMiddleware(window.leanFormsAdmin?.nonce || ''));
  }, []);

  const isAddonEnabled = (addon) => {
    return settings[addon.option] || false;
  };

  const updateAddonSetting = async (addon, value) => {
    if (!addon.option) return;
    
    setUpdating(prev => ({ ...prev, [addon.id]: true }));
    
    try {
      // Optimistically update the UI
      dispatch.updateSetting(addon.option, value);
      
      // Make API call
      const response = await apiFetch({
        path: '/lean-forms/v1/settings',
        method: 'POST',
        data: { [addon.option]: value },
      });
      
      // Show success notification
      setNotification({
        type: 'success',
        message: response.message || __('Add-on setting updated successfully!', 'lean-forms'),
      });
      
    } catch (error) {
      console.error('Error updating addon setting:', error);
      
      // Revert optimistic update
      dispatch.updateSetting(addon.option, !value);
      
      // Show error notification
      setNotification({
        type: 'error',
        message: error.message || __('Failed to update add-on setting. Please try again.', 'lean-forms'),
      });
      
    } finally {
      setUpdating(prev => ({ ...prev, [addon.id]: false }));
    }
  };

  // Combine all addons
  const allAddons = [
    ...LITE_ADDONS.map(addon => ({ ...addon, isPro: false })),
    ...PRO_ADDONS.map(addon => ({ ...addon, isPro: true }))
  ];

  if (settingsLoading && Object.keys(settings).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {/* Simple Header */}
      <div className="mb-8">
        <h1 className="text-xl font-medium text-primary mb-2">
          {__('Add-ons', 'lean-forms')}
        </h1>
        <p className="text-sm text-secondary">
          {__('Enable or disable features for your forms.', 'lean-forms')}
        </p>
      </div>

      {/* Card Grid - Fixed 4 columns */}
      <div className="grid grid-cols-4 gap-4">
        {allAddons.map((addon) => (
          <AddonCard
            key={addon.id}
            addon={addon}
            isEnabled={isAddonEnabled(addon)}
            onToggle={(value) => updateAddonSetting(addon, value)}
            isUpdating={updating[addon.id]}
            isPro={addon.isPro}
          />
        ))}
      </div>

      {/* Simple Pro Link */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">
            {__('Want more features?', 'lean-forms')}
          </p>
          <a
            href="https://plugpress.io/lean-forms"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
          >
            {__('Upgrade to Pro', 'lean-forms')}
            <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Snackbar Notifications */}
      {notification && (
        <Snackbar
          onRemove={() => setNotification(null)}
          isDismissible
          className={notification.type === 'error' ? 'components-snackbar--error' : ''}
        >
          {notification.message}
        </Snackbar>
      )}
    </div>
  );
};

export default AddonsPage;