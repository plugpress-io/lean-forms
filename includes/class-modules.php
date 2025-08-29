<?php

/**
 * Lean Forms feature Loader Base Class
 *
 * @package Lean_Forms
 */

namespace Lean_Forms;

class Modules
{
    protected $features = [];
    protected $feature_option_name = 'lean_forms_enabled_features';
    protected $plugin_dir = LEAN_FORMS_PLUGIN_DIR;

    public function __construct()
    {
        add_action('init', [$this, 'load_features'], 20);

        // Hook for pro version to extend
        add_action('lean_forms_register_features', [$this, 'register_features']);
    }

    /**
     * Load all enabled add-ons
     */
    public function load_features()
    {
        $this->register_features();

        // Allow other plugins (like pro) to register their features
        do_action('lean_forms_register_features', $this);

        $this->initialize_features();
    }

    /**
     * Register available add-ons (override in child classes)
     */
    public function register_features()
    {
        $this->features = [
            'grid' => [
                'name' => __('Grid System', 'lean-forms'),
                'file' => 'modules/grid/class-grid.php',
                'class' => '\\Lean_Forms\\Modules\\Grid',
                'option' => 'lean_forms_enable_grid',
                'type' => 'Lite',
            ],
            'entries' => [
                'name' => __('Entries Management', 'lean-forms'),
                'file' => 'modules/entries/class-entries.php',
                'class' => '\\Lean_Forms\\Modules\\Entries',
                'type' => 'Lite',
            ],
            'form_presets' => [
                'name' => __('Form Presets', 'lean-forms'),
                'file' => 'modules/form-presets/class-form-presets.php',
                'class' => '\\Lean_Forms\\Modules\\Form_Presets',
                'option' => 'lean_forms_enable_form_presets',
                'type' => 'Lite',
            ],
        ];

        // Allow filtering of features
        $this->features = apply_filters('lean_forms_features', $this->features);
    }

    /**
     * Add feature to the registry (used by pro version)
     */
    public function add_feature($feature_key, $feature_data)
    {
        $this->features[$feature_key] = $feature_data;
    }

    /**
     * Initialize enabled add-ons
     */
    protected function initialize_features()
    {
        $enabled_features = $this->get_enabled_features_from_option();

        foreach ($this->features as $feature_key => $feature) {
            // Check if add-on is enabled
            if (!isset($enabled_features[$feature_key]) || !$enabled_features[$feature_key]) {
                continue;
            }

            // Check if file exists (use feature's plugin_dir if specified)
            $plugin_dir = isset($feature['plugin_dir']) ? $feature['plugin_dir'] : $this->plugin_dir;
            $file_path = $plugin_dir . 'includes/' . $feature['file'];
            if (!file_exists($file_path)) {
                continue;
            }

            // Load the add-on file
            require_once $file_path;

            // Initialize the add-on class
            if (class_exists($feature['class'])) {
                new $feature['class']();
            }
        }
    }

    /**
     * Get enabled add-ons from single option
     */
    protected function get_enabled_features_from_option()
    {
        return get_option($this->feature_option_name, []);
    }

    /**
     * Get all registered add-ons
     */
    public function get_features()
    {
        return $this->features;
    }

    /**
     * Get enabled add-ons
     */
    public function get_enabled_features()
    {
        $enabled = [];
        $enabled_features = $this->get_enabled_features_from_option();

        foreach ($this->features as $feature_key => $feature) {
            if (isset($enabled_features[$feature_key]) && $enabled_features[$feature_key]) {
                $enabled[$feature_key] = $feature;
            }
        }

        return $enabled;
    }

    /**
     * Check if specific add-on is enabled
     */
    public function is_feature_enabled($feature_key)
    {
        if (!isset($this->features[$feature_key])) {
            return false;
        }

        $enabled_features = $this->get_enabled_features_from_option();
        return isset($enabled_features[$feature_key]) && $enabled_features[$feature_key];
    }

    /**
     * Enable add-on
     */
    public function enable_feature($feature_key)
    {
        if (!isset($this->features[$feature_key])) {
            return false;
        }

        $enabled_features = $this->get_enabled_features_from_option();
        $enabled_features[$feature_key] = true;

        return update_option($this->feature_option_name, $enabled_features);
    }

    /**
     * Disable add-on
     */
    public function disable_feature($feature_key)
    {
        if (!isset($this->features[$feature_key])) {
            return false;
        }

        $enabled_features = $this->get_enabled_features_from_option();
        $enabled_features[$feature_key] = false;

        return update_option($this->feature_option_name, $enabled_features);
    }
}
