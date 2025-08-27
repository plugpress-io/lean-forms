<?php

/**
 * Utility Functions
 *
 * @package Lean_Forms
 */

namespace Lean_Forms;

class Utils
{

    /**
     * Check if Contact Form 7 is active
     */
    public static function is_cf7_active()
    {
        return class_exists('WPCF7_ContactForm');
    }

    /**
     * Get Contact Form 7 forms
     */
    public static function get_cf7_forms()
    {
        if (!self::is_cf7_active()) {
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

    /**
     * Format date for display
     */
    public static function format_date($date_string, $format = 'Y-m-d H:i:s')
    {
        if (empty($date_string)) {
            return '';
        }

        $timestamp = strtotime($date_string);
        if ($timestamp === false) {
            return $date_string;
        }

        return wp_date($format, $timestamp);
    }

    /**
     * Get status badge HTML
     */
    public static function get_status_badge($status)
    {
        $status_classes = [
            'new' => 'status-new',
            'read' => 'status-read',
            'spam' => 'status-spam',
        ];

        $status_labels = [
            'new' => __('New', 'lean-forms'),
            'read' => __('Read', 'lean-forms'),
            'spam' => __('Spam', 'lean-forms'),
        ];

        $class = $status_classes[$status] ?? 'status-default';
        $label = $status_labels[$status] ?? $status;

        return sprintf(
            '<span class="lean-forms-status-badge %s">%s</span>',
            esc_attr($class),
            esc_html($label)
        );
    }

    /**
     * Sanitize form data for display
     */
    public static function sanitize_form_data($data)
    {
        if (empty($data) || !is_array($data)) {
            return [];
        }

        $sanitized = [];
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $sanitized[$key] = array_map('sanitize_text_field', $value);
            } else {
                $sanitized[$key] = sanitize_text_field($value);
            }
        }

        return $sanitized;
    }

    /**
     * Get entry count by status
     */
    public static function get_entry_count_by_status($status = null)
    {
        $args = [
            'post_type' => 'lean_forms_entry',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'fields' => 'ids',
        ];

        if ($status) {
            $args['meta_query'] = [
                [
                    'key' => '_lf_status',
                    'value' => $status,
                    'compare' => '=',
                ],
            ];
        }

        $query = new \WP_Query($args);
        return $query->found_posts;
    }

    /**
     * Get total entry count
     */
    public static function get_total_entry_count()
    {
        return self::get_entry_count_by_status();
    }

    /**
     * Get new entry count
     */
    public static function get_new_entry_count()
    {
        return self::get_entry_count_by_status('new');
    }

    /**
     * Get spam entry count
     */
    public static function get_spam_entry_count()
    {
        return self::get_entry_count_by_status('spam');
    }

    /**
     * Check if user can manage entries
     */
    public static function can_manage_entries()
    {
        return current_user_can('manage_options');
    }

    /**
     * Get plugin version
     */
    public static function get_version()
    {
        return LEAN_FORMS_VERSION;
    }

    /**
     * Get plugin URL
     */
    public static function get_plugin_url()
    {
        return LEAN_FORMS_PLUGIN_URL;
    }

    /**
     * Get plugin directory
     */
    public static function get_plugin_dir()
    {
        return LEAN_FORMS_PLUGIN_DIR;
    }

    /**
     * Parse shortcode attributes with defaults
     */
    public static function parse_atts($atts, $defaults = array())
    {
        if (empty($atts)) {
            return $defaults;
        }

        // Handle both array and string formats
        if (is_string($atts)) {
            $atts = self::parse_shortcode_atts($atts);
        }

        return wp_parse_args($atts, $defaults);
    }

    /**
     * Parse shortcode attributes from string format
     */
    public static function parse_shortcode_atts($atts_string)
    {
        $atts = array();

        // Handle key:value format
        if (preg_match_all('/(\w+):([^\s]+)/', $atts_string, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $atts[$match[1]] = $match[2];
            }
        }

        // Handle key="value" format
        if (preg_match_all('/(\w+)="([^"]*)"/', $atts_string, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $atts[$match[1]] = $match[2];
            }
        }

        return $atts;
    }
}
