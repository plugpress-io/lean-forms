/**
 * Dynamic Feature Settings Page
 * Handles settings for individual features/integrations
 */

import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Save, Key, Globe, Database } from 'lucide-react';
import { showToast } from '../components/ui/toast';
import apiFetch from '@wordpress/api-fetch';

// Integration configurations
const INTEGRATION_CONFIGS = {
  google_sheets: {
    name: __('Google Sheets Integration', 'lean-forms'),
    icon: Database,
    description: __('Connect your forms to Google Sheets for automatic data sync.', 'lean-forms'),
    fields: [
      {
        key: 'client_id',
        label: __('Google Client ID', 'lean-forms'),
        type: 'text',
        placeholder: __('Enter your Google OAuth Client ID', 'lean-forms'),
        required: true,
        help: __('Get this from Google Cloud Console > APIs & Services > Credentials', 'lean-forms')
      },
      {
        key: 'client_secret',
        label: __('Google Client Secret', 'lean-forms'),
        type: 'password',
        placeholder: __('Enter your Google OAuth Client Secret', 'lean-forms'),
        required: true,
        help: __('Keep this secret and never share it publicly', 'lean-forms')
      },
      {
        key: 'spreadsheet_id',
        label: __('Spreadsheet ID', 'lean-forms'),
        type: 'text',
        placeholder: __('Enter your Google Sheets spreadsheet ID', 'lean-forms'),
        required: false,
        help: __('Found in the Google Sheets URL between /d/ and /edit', 'lean-forms')
      }
    ],
    docs: {
      title: __('Setup Instructions', 'lean-forms'),
      steps: [
        __('1. Go to Google Cloud Console and create a new project', 'lean-forms'),
        __('2. Enable the Google Sheets API', 'lean-forms'),
        __('3. Create OAuth 2.0 credentials', 'lean-forms'),
        __('4. Add your website domain to authorized origins', 'lean-forms'),
        __('5. Copy the Client ID and Client Secret here', 'lean-forms')
      ]
    }
  },
  emailoctopus: {
    name: __('EmailOctopus Integration', 'lean-forms'),
    icon: Globe,
    description: __('Add form subscribers to your EmailOctopus lists automatically.', 'lean-forms'),
    fields: [
      {
        key: 'api_key',
        label: __('API Key', 'lean-forms'),
        type: 'password',
        placeholder: __('Enter your EmailOctopus API key', 'lean-forms'),
        required: true,
        help: __('Find this in your EmailOctopus account settings', 'lean-forms')
      },
      {
        key: 'list_id',
        label: __('Default List ID', 'lean-forms'),
        type: 'text',
        placeholder: __('Enter your default list ID', 'lean-forms'),
        required: false,
        help: __('Contacts will be added to this list by default', 'lean-forms')
      }
    ],
    docs: {
      title: __('Setup Instructions', 'lean-forms'),
      steps: [
        __('1. Log into your EmailOctopus account', 'lean-forms'),
        __('2. Go to Settings > API', 'lean-forms'),
        __('3. Generate a new API key', 'lean-forms'),
        __('4. Copy the API key and paste it here', 'lean-forms'),
        __('5. Optionally set a default list ID', 'lean-forms')
      ]
    }
  },
  mailchimp: {
    name: __('Mailchimp Integration', 'lean-forms'),
    icon: Globe,
    description: __('Sync form submissions with your Mailchimp audience lists.', 'lean-forms'),
    fields: [
      {
        key: 'api_key',
        label: __('API Key', 'lean-forms'),
        type: 'password',
        placeholder: __('Enter your Mailchimp API key', 'lean-forms'),
        required: true,
        help: __('Find this in your Mailchimp account under Account > Extras > API keys', 'lean-forms')
      },
      {
        key: 'audience_id',
        label: __('Default Audience ID', 'lean-forms'),
        type: 'text',
        placeholder: __('Enter your default audience ID', 'lean-forms'),
        required: false,
        help: __('Subscribers will be added to this audience by default', 'lean-forms')
      }
    ],
    docs: {
      title: __('Setup Instructions', 'lean-forms'),
      steps: [
        __('1. Log into your Mailchimp account', 'lean-forms'),
        __('2. Go to Account > Extras > API keys', 'lean-forms'),
        __('3. Create a new API key or use an existing one', 'lean-forms'),
        __('4. Copy the API key and paste it here', 'lean-forms'),
        __('5. Find your Audience ID in Audience > Settings > Audience name and defaults', 'lean-forms')
      ]
    }
  },
  airtable: {
    name: __('Airtable Integration', 'lean-forms'),
    icon: Database,
    description: __('Send form submissions directly to your Airtable bases.', 'lean-forms'),
    fields: [
      {
        key: 'api_key',
        label: __('API Key', 'lean-forms'),
        type: 'password',
        placeholder: __('Enter your Airtable API key', 'lean-forms'),
        required: true,
        help: __('Generate this from your Airtable account page', 'lean-forms')
      },
      {
        key: 'base_id',
        label: __('Base ID', 'lean-forms'),
        type: 'text',
        placeholder: __('Enter your Airtable base ID', 'lean-forms'),
        required: true,
        help: __('Found in your Airtable API documentation for your base', 'lean-forms')
      },
      {
        key: 'table_name',
        label: __('Table Name', 'lean-forms'),
        type: 'text',
        placeholder: __('Enter the table name', 'lean-forms'),
        required: true,
        help: __('The exact name of the table where data will be sent', 'lean-forms')
      }
    ],
    docs: {
      title: __('Setup Instructions', 'lean-forms'),
      steps: [
        __('1. Go to airtable.com/account and generate an API key', 'lean-forms'),
        __('2. Open your Airtable base and go to Help > API documentation', 'lean-forms'),
        __('3. Find your Base ID in the introduction section', 'lean-forms'),
        __('4. Copy the Base ID and API key here', 'lean-forms'),
        __('5. Enter the exact table name where data should be sent', 'lean-forms')
      ]
    }
  }
};

const FeatureSettings = ({ featureId, navigate }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const config = INTEGRATION_CONFIGS[featureId];

  useEffect(() => {
    loadSettings();
  }, [featureId]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await apiFetch({
        path: `/lean-forms/v1/integration-settings/${featureId}`,
        method: 'GET',
      });
      
      if (response.success) {
        setSettings(response.data || {});
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      showToast.error(__('Failed to load settings', 'lean-forms'));
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await apiFetch({
        path: `/lean-forms/v1/integration-settings/${featureId}`,
        method: 'POST',
        data: settings,
      });
      
      if (response.success) {
        showToast.success(__('Settings saved successfully!', 'lean-forms'));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast.error(error.message || __('Failed to save settings', 'lean-forms'));
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!config) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('features')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {__('Back to Features', 'lean-forms')}
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">{__('Settings Not Available', 'lean-forms')}</h2>
          <p className="text-muted-foreground">{__('This feature does not have configurable settings.', 'lean-forms')}</p>
        </div>
      </div>
    );
  }

  const IconComponent = config.icon;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">
          {__('Loading settings...', 'lean-forms')}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('features')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {__('Back to Features', 'lean-forms')}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <IconComponent className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{config.name}</h1>
          <p className="text-muted-foreground mt-1">{config.description}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Key className="h-5 w-5" />
              {__('Configuration', 'lean-forms')}
            </h2>
            
            <div className="space-y-4">
              {config.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label htmlFor={field.key} className="block text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={settings[field.key] || ''}
                    onChange={(e) => updateSetting(field.key, e.target.value)}
                    required={field.required}
                  />
                  {field.help && (
                    <p className="text-xs text-muted-foreground">{field.help}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button onClick={saveSettings} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? __('Saving...', 'lean-forms') : __('Save Settings', 'lean-forms')}
              </Button>
              <Button variant="outline" onClick={() => navigate('features')}>
                {__('Cancel', 'lean-forms')}
              </Button>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">{config.docs.title}</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {config.docs.steps.map((step, index) => (
                <li key={index} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSettings;
