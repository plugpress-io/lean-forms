/**
 * Minimal Addon Card with Full-Width Icon and Custom Toggle
 */

import React from 'react';
import { __ } from '@wordpress/i18n';

// Minimal custom toggle switch (no jQuery, no WP ToggleControl)
function MinimalToggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      tabIndex={0}
      onClick={() => !disabled && onChange && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        disabled
          ? 'bg-gray-200 cursor-not-allowed'
          : checked
          ? 'bg-primary'
          : 'bg-gray-300'
      }`}
      style={{ minWidth: 44 }}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

const AddonCard = ({
  addon,
  isEnabled,
  onToggle,
  isUpdating = false,
  isPro = false,
}) => {
  const IconComponent = addon.icon;

  return (
    <div className="rounded-lg bg-white flex flex-col overflow-hidden min-w-[220px] border border-gray-200 shadow-sm">
      {/* Full-width Icon with Overlaid Badges */}
      <div className="w-full aspect-[4/2] bg-slate-100 flex items-center justify-center relative">
        {IconComponent && (
          <span className="w-full flex items-center justify-center">
            <IconComponent className="w-9 h-9 text-primary" />
          </span>
        )}
        
        {/* Badges Overlaid on Thumbnail */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isPro ? (
            <span className="px-2 py-0.5 text-xs rounded bg-yellow-600 text-white font-semibold shadow">Pro</span>
          ) : (
            <span className="px-2 py-0.5 text-xs rounded bg-green-600 text-white font-semibold shadow">Lite</span>
          )}
          {addon.planned && (
            <span className="px-2 py-0.5 text-xs rounded bg-gray-600 text-white font-semibold shadow">Planned</span>
          )}
        </div>
      </div>

      {/* Card Content - Left Aligned */}
      <div className="flex flex-col flex-1 px-4 py-3">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-1 text-left">{addon.title}</h3>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-4 min-h-[32px] text-left leading-relaxed">{addon.description}</p>

        {/* Toggle */}
        <div className="mt-auto">
          <MinimalToggle
            checked={!isPro && isEnabled}
            onChange={onToggle}
            disabled={isPro || isUpdating || addon.planned}
          />
        </div>
      </div>
    </div>
  );
};

export default AddonCard;