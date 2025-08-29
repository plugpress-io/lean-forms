<?php

/**
 * Admin Setup
 *
 * @package Lean_Forms
 */

namespace Lean_Forms;

class Admin
{

    public function __construct()
    {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu()
    {
        // Main dashboard page
        add_menu_page(
            __('Lean Forms', 'lean-forms'),
            __('Lean Forms', 'lean-forms'),
            'manage_options',
            'lean-forms',
            [$this, 'render_dashboard_page'],
            'dashicons-feedback',
            30
        );

        // Dashboard submenu (same as main page)
        add_submenu_page(
            'lean-forms',
            __('Dashboard', 'lean-forms'),
            __('Dashboard', 'lean-forms'),
            'manage_options',
            'lean-forms',
            [$this, 'render_dashboard_page']
        );

        // add_submenu_page(
        //     'lean-forms',
        //     __('Add Form', 'lean-forms'),
        //     __('Add Form', 'lean-forms'),
        //     'manage_options',
        //     'lean-forms#/add-form',
        //     [$this, 'render_dashboard_page']
        // );

        add_submenu_page(
            'lean-forms',
            __('Entries', 'lean-forms'),
            __('Entries', 'lean-forms'),
            'manage_options',
            'lean-forms#/entries',
            [$this, 'render_dashboard_page']
        );

        add_submenu_page(
            'lean-forms',
            __('Features', 'lean-forms'),
            __('Features', 'lean-forms'),
            'manage_options',
            'lean-forms#/features',
            [$this, 'render_dashboard_page']
        );

        add_submenu_page(
            'lean-forms',
            __('License', 'lean-forms'),
            __('License', 'lean-forms'),
            'manage_options',
            'lean-forms#/license',
            [$this, 'render_dashboard_page']
        );
    }

    /**
     * Render dashboard page
     */
    public function render_dashboard_page()
    {
        echo '<div id="lean-forms-app"></div>';
    }

    /**
     * Enqueue admin scripts and styles
     */
    public function enqueue_admin_scripts($hook)
    {
        // Only load on our plugin pages
        if (strpos($hook, 'lean-forms') === false) {
            return;
        }

        // Enqueue admin app
        wp_enqueue_script(
            'lean-forms-app',
            LEAN_FORMS_PLUGIN_URL . 'build/admin.js',
            ['wp-element', 'wp-components', 'wp-i18n', 'wp-data', 'wp-api-fetch'],
            LEAN_FORMS_VERSION,
            true
        );

        wp_enqueue_style(
            'lean-forms-app',
            LEAN_FORMS_PLUGIN_URL . 'build/admin.css',
            [],
            LEAN_FORMS_VERSION
        );

        // Localize script with data
        wp_localize_script('lean-forms-app', 'leanFormsAdmin', [
            'apiUrl' => rest_url('lean-forms/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'strings' => [
                'loading' => __('Loading...', 'lean-forms'),
                'noEntries' => __('No entries found.', 'lean-forms'),
                'error' => __('An error occurred.', 'lean-forms'),
                'confirmDelete' => __('Are you sure you want to delete this entry?', 'lean-forms'),
                'entryDeleted' => __('Entry deleted successfully.', 'lean-forms'),
                'statusUpdated' => __('Status updated successfully.', 'lean-forms'),
                'exportSuccess' => __('Export completed successfully.', 'lean-forms'),
            ],
            'forms' => $this->get_available_forms(),
            'get_features' => $this->get_features(),
            'proPlugin' => [
                'installed' => $this->is_pro_plugin_active(),
                'version' => $this->get_pro_plugin_version(),
            ],
        ]);
    }

    /**
     * Get available Contact Form 7 forms
     */
    private function get_available_forms()
    {
        if (!class_exists('WPCF7_ContactForm')) {
            return [];
        }

        $forms = \WPCF7_ContactForm::find();
        $form_list = [];

        foreach ($forms as $form) {
            $form_list[] = [
                'id' => $form->id(),
                'title' => $form->title(),
            ];
        }

        return $form_list;
    }

    private function get_features()
    {
        $features = get_option('lean_forms_features');
        if (!$features) {
            return [];
        }

        return $features;
    }

    /**
     * Check if Pro plugin is active
     */
    private function is_pro_plugin_active()
    {
        // Check if Pro plugin class exists or if plugin is active
        $class_exists = class_exists('Lean_Forms_Pro');
        $plugin_active = is_plugin_active('lean-forms-pro/lean-forms-pro.php');



        return $class_exists || $plugin_active;
    }

    /**
     * Get Pro plugin version if available
     */
    private function get_pro_plugin_version()
    {
        if (defined('LEAN_FORMS_PRO_VERSION')) {
            return LEAN_FORMS_PRO_VERSION;
        }

        return null;
    }
}
