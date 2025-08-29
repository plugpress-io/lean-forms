import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Key, Shield, ExternalLink, Star, Zap } from 'lucide-react';
import apiFetch from '@wordpress/api-fetch';
import { showToast } from '../components/ui/toast';

const License = () => {
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseStatus, setLicenseStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Initialize Pro status from server-side data
  const [proInstalled, setProInstalled] = useState(
    window.leanFormsAdmin?.proPlugin?.installed || false
  );
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if Pro plugin is installed and get license status
  useEffect(() => {
    // Use server-side data if available
    if (window.leanFormsAdmin?.proPlugin?.installed) {
      setProInstalled(true);
    }
    
    checkProStatus();
  }, []);

  const checkProStatus = async () => {
    setCheckingStatus(true);
    
    // Use server-side data as primary source
    const serverProInstalled = window.leanFormsAdmin?.proPlugin?.installed || false;
    
    if (serverProInstalled) {
      setProInstalled(true);
      
      // Get license status if Pro is installed
      try {
        const licenseResponse = await apiFetch({
          path: '/lean-forms-pro/v1/license',
          method: 'GET',
        });
        

        
        if (licenseResponse.success && licenseResponse.data) {
          setLicenseStatus(licenseResponse.data);
          
          if (licenseResponse.data.license_key) {
            setLicenseKey(licenseResponse.data.license_key);
          }
        }
      } catch (licenseError) {
        setLicenseStatus(null);
      }
    } else {
      // Fallback: Try API detection
      try {
        await apiFetch({
          path: '/lean-forms-pro/v1/settings',
          method: 'GET',
        });
        

        setProInstalled(true);
      } catch (error) {
        setProInstalled(false);
        setLicenseStatus(null);
      }
    }
    
    setCheckingStatus(false);
  };

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      showToast.error(__('Please enter a valid license key', 'lean-forms'));
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await apiFetch({
        path: '/lean-forms-pro/v1/license',
        method: 'POST',
        data: { license_key: licenseKey.trim() },
      });
      
      if (response.success) {
        setLicenseStatus(response.data);
        showToast.success(__('License activated successfully!', 'lean-forms'));
      } else {
        showToast.error(response.message || __('License activation failed', 'lean-forms'));
      }
    } catch (error) {
      console.error('License activation error:', error);
      showToast.error(__('License activation failed. Please try again.', 'lean-forms'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setLoading(true);
    
    try {
      const response = await apiFetch({
        path: '/lean-forms-pro/v1/license',
        method: 'DELETE',
      });
      
      if (response.success) {
        setLicenseStatus(null);
        setLicenseKey('');
        showToast.success(__('License deactivated successfully!', 'lean-forms'));
      } else {
        showToast.error(response.message || __('License deactivation failed', 'lean-forms'));
      }
    } catch (error) {
      console.error('License deactivation error:', error);
      showToast.error(__('License deactivation failed. Please try again.', 'lean-forms'));
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">
          {__('Checking license status...', 'lean-forms')}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Key className="h-8 w-8 text-primary" />
          {__('License', 'lean-forms')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {proInstalled 
            ? __('Manage your Lean Forms Pro license.', 'lean-forms')
            : __('Unlock premium features with Lean Forms Pro.', 'lean-forms')
          }
        </p>
      </div>

      {!proInstalled ? (
        // Pro Plugin Not Installed - Promotional Content
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Get Pro Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{__('Lean Forms Pro', 'lean-forms')}</h2>
                <p className="text-sm text-muted-foreground">{__('Unlock premium features', 'lean-forms')}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{__('Advanced Form Fields (Rating, Slider, Signature)', 'lean-forms')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{__('Multi-Step Forms & Conditional Logic', 'lean-forms')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{__('Premium Integrations (Google Sheets, Mailchimp)', 'lean-forms')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{__('Priority Support & Updates', 'lean-forms')}</span>
              </div>
            </div>
            
            <Button 
              className="w-full"
              onClick={() => window.open('https://plugpress.io/lean-forms', '_blank')}
            >
              {__('Get Lean Forms Pro', 'lean-forms')}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Benefits Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Shield className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{__('Why Pro?', 'lean-forms')}</h2>
                <p className="text-sm text-muted-foreground">{__('Professional form building', 'lean-forms')}</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                {__('Lean Forms Pro extends your form building capabilities with advanced fields, multi-step workflows, and powerful integrations.', 'lean-forms')}
              </p>
              <p>
                {__('Perfect for businesses, agencies, and developers who need professional-grade form solutions.', 'lean-forms')}
              </p>
              <div className="pt-4 border-t">
                <p className="font-medium text-foreground mb-2">{__('What you get:', 'lean-forms')}</p>
                <ul className="space-y-1">
                  <li>• {__('All premium features unlocked', 'lean-forms')}</li>
                  <li>• {__('Lifetime updates', 'lean-forms')}</li>
                  <li>• {__('Priority email support', 'lean-forms')}</li>
                  <li>• {__('Commercial use license', 'lean-forms')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Pro Plugin Installed - License Management
        <div className="max-w-2xl">
          {/* License Status Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{__('License Management', 'lean-forms')}</h2>
                <p className="text-sm text-muted-foreground">
                  {licenseStatus?.status === 'active' 
                    ? __('Your license is active and all Pro features are available.', 'lean-forms')
                    : __('Activate your license to unlock Pro features.', 'lean-forms')
                  }
                </p>
              </div>
              {licenseStatus?.status === 'active' && (
                <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 ml-auto">
                  <CheckCircle className="w-3 h-3" />
                  {__('Active', 'lean-forms')}
                </Badge>
              )}
            </div>

            {/* License Key Input */}
            <div className="space-y-4">
              <div>
                <label htmlFor="license-key" className="block text-sm font-medium mb-2">
                  {__('License Key', 'lean-forms')}
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="license-key"
                      type="text"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      placeholder={__('Enter your license key', 'lean-forms')}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                  
                  {licenseStatus?.status === 'active' ? (
                    <Button
                      variant="outline"
                      onClick={handleDeactivate}
                      disabled={loading}
                    >
                      {loading ? __('Deactivating...', 'lean-forms') : __('Deactivate', 'lean-forms')}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleActivate}
                      disabled={loading || !licenseKey.trim()}
                    >
                      {loading ? __('Activating...', 'lean-forms') : __('Activate', 'lean-forms')}
                    </Button>
                  )}
                </div>
              </div>

              {/* License Details */}
              {licenseStatus && (
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{__('Status:', 'lean-forms')}</span>
                    <Badge variant={licenseStatus.status === 'active' ? 'default' : 'secondary'}>
                      {licenseStatus.status}
                    </Badge>
                  </div>
                  
                  {licenseStatus.expires_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{__('Expires:', 'lean-forms')}</span>
                      <span className="font-medium">
                        {new Date(licenseStatus.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {licenseStatus.activation_limit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{__('Activations:', 'lean-forms')}</span>
                      <span className="font-medium">
                        {licenseStatus.activation_usage || 0} / {licenseStatus.activation_limit}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {__('Need Help?', 'lean-forms')}
            </h3>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                {__('Having trouble with your license? Here are some common solutions:', 'lean-forms')}
              </p>
              
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{__('Check your email for the license key after purchase', 'lean-forms')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{__('Make sure you have the Pro plugin installed and activated', 'lean-forms')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{__('Each license can be used on the specified number of sites', 'lean-forms')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{__('Deactivate unused sites to free up activations', 'lean-forms')}</span>
                </li>
              </ul>
              
              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://plugpress.io/support', '_blank')}
                >
                  {__('Contact Support', 'lean-forms')}
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default License;
