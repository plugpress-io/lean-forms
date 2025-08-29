import React from 'react';
import { __ } from '@wordpress/i18n';
import { cn } from './lib/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';

// Toggle Switch Component
function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

const FeatureCard = ({ 
  feature, 
  isEnabled, 
  onToggle, 
  isUpdating = false,
  isPlanned = false,
  isDisabled = false,
  proStatus = { installed: false, licensed: false, loading: false },
  onSettingsClick
}) => {
  const IconComponent = feature.icon;
  
  // Check if we're currently on this feature's settings page
  const currentPath = window.location.hash.replace('#/', '');
  const isOnSettingsPage = currentPath === `settings/${feature.id}`;

  // Get badge variant based on feature type
  const getBadgeVariant = (type) => {
    switch (type) {
      case 'Pro':
        return 'pro';
      case 'Lite':
        return 'lite';
      default:
        return 'secondary';
    }
  };

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md",
      isDisabled && "opacity-75"
    )}>
      {/* Icon Area */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
        {IconComponent && <IconComponent className="h-6 w-6 text-muted-foreground" />}
      </div>

      {/* Badge */}
      <div className="absolute top-4 right-4 space-x-2 flex">
        <Badge variant={getBadgeVariant(feature.type)}>
          {feature.type}
        </Badge>
        {isPlanned && (
          <Badge variant="planned">
            {__('Planned', 'lean-forms')}
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-card-foreground">
        {feature.name}
      </h3>

      {/* Description */}
      <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>

      {/* Card Footer */}
      <div className="flex items-center justify-between">
        {isDisabled ? (
          // Show upgrade button for disabled pro features
          <button
            onClick={() => {
              if (!proStatus.installed) {
                window.open('https://plugpress.io/lean-forms', '_blank');
              } else {
                // Navigate to license page if pro is installed but not licensed
                if (window.location.hash) {
                  window.location.hash = '#/license';
                }
              }
            }}
            className="text-sm font-medium text-card-foreground hover:text-primary transition-colors"
          >
            {!proStatus.installed 
              ? __('Get Pro', 'lean-forms')
              : __('Activate License', 'lean-forms')
            }
          </button>
        ) : (
          // Left side - Settings icon (if enabled and has settings, but not on settings page)
          <div className="flex items-center">
            {isEnabled && !isDisabled && feature.hasSettings && onSettingsClick && !isOnSettingsPage && (
              <Settings 
                className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
                onClick={() => onSettingsClick(feature)}
                title={__('Settings', 'lean-forms')}
              />
            )}
          </div>
        )}
        
        {/* Right side - Toggle with status text */}
        {!isDisabled && (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-muted-foreground">
              {isEnabled ? __('Enabled', 'lean-forms') : __('Disabled', 'lean-forms')}
            </span>
            <ToggleSwitch
              checked={isEnabled}
              onChange={onToggle}
              disabled={isUpdating}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;
