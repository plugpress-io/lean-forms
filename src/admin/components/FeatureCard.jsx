/**
 * Feature Card Component
 * Displays individual features with toggle functionality
 */

import React from 'react';
import { __ } from '@wordpress/i18n';
import { cn } from './lib/utils';
import { Badge } from './ui/badge';

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
  isUpdating = false 
}) => {
  const IconComponent = feature.icon;

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'Pro':
        return 'default';
      case 'Lite':
        return 'secondary';
      case 'Planned':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      {/* Icon Area */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
        {IconComponent && <IconComponent className="h-6 w-6 text-muted-foreground" />}
      </div>

      {/* Badge */}
      <div className="absolute top-4 right-4">
        <Badge variant={getBadgeVariant(feature.type)}>
          {feature.type}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-card-foreground">
        {feature.name}
      </h3>

      {/* Description */}
      <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>

      {/* Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-card-foreground">
          {isEnabled ? __('Enabled', 'lean-forms') : __('Disabled', 'lean-forms')}
        </span>
        <ToggleSwitch
          checked={isEnabled}
          onChange={onToggle}
          disabled={isUpdating || feature.type === 'Planned'}
        />
      </div>

      {/* Loading overlay */}
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
};

export default FeatureCard;
