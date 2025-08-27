<?php

/**
 * Custom Post Type for Form Entries
 *
 * @package Lean_Forms
 */

namespace Lean_Forms;

class CPT
{

    public function __construct()
    {
        add_action('init', [$this, 'register_post_type']);
        add_action('init', [$this, 'register_meta']);
        add_action('add_meta_boxes', [$this, 'add_meta_boxes']);
        add_action('save_post', [$this, 'save_meta']);
    }

    /**
     * Register the lean_forms_entry post type
     */
    public function register_post_type()
    {
        $labels = [
            'name'               => __('Form Entries', 'lean-forms'),
            'singular_name'      => __('Form Entry', 'lean-forms'),
            'menu_name'          => __('Form Entries', 'lean-forms'),
            'add_new'            => __('Add New', 'lean-forms'),
            'add_new_item'       => __('Add New Entry', 'lean-forms'),
            'edit_item'          => __('Edit Entry', 'lean-forms'),
            'new_item'           => __('New Entry', 'lean-forms'),
            'view_item'          => __('View Entry', 'lean-forms'),
            'search_items'       => __('Search Entries', 'lean-forms'),
            'not_found'          => __('No entries found', 'lean-forms'),
            'not_found_in_trash' => __('No entries found in trash', 'lean-forms'),
        ];

        $args = [
            'labels'              => $labels,
            'public'              => false,
            'show_ui'             => true,
            'show_in_menu'        => false, // We'll add it to our custom menu
            'show_in_admin_bar'   => false,
            'show_in_rest'        => true,
            'capability_type'     => 'post',
            'hierarchical'        => false,
            'menu_position'       => null,
            'supports'            => ['title', 'custom-fields'],
            'has_archive'         => false,
            'rewrite'             => false,
            'query_var'           => false,
            'delete_with_user'    => false,
        ];

        register_post_type('lean_forms_entry', $args);
    }

    /**
     * Register meta fields for REST API access
     */
    public function register_meta()
    {
        register_meta('post', '_lf_form_id', [
            'type' => 'integer',
            'description' => 'Contact Form 7 ID',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'intval',
        ]);

        register_meta('post', '_lf_status', [
            'type' => 'string',
            'description' => 'Entry status (new, read, spam)',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => [$this, 'sanitize_status'],
        ]);

        register_meta('post', '_lf_data', [
            'type' => 'string',
            'description' => 'Form submission data as JSON',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => [$this, 'sanitize_json'],
        ]);

        register_meta('post', '_lf_created', [
            'type' => 'string',
            'description' => 'Entry creation timestamp',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'sanitize_text_field',
        ]);

        register_meta('post', '_lf_ip', [
            'type' => 'string',
            'description' => 'Submitter IP address',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'sanitize_text_field',
        ]);

        register_meta('post', '_lf_ua', [
            'type' => 'string',
            'description' => 'Submitter user agent',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'sanitize_text_field',
        ]);
    }

    /**
     * Add meta boxes for entry details
     */
    public function add_meta_boxes()
    {
        add_meta_box(
            'lean_forms_entry_details',
            __('Entry Details', 'lean-forms'),
            [$this, 'meta_box_callback'],
            'lean_forms_entry',
            'normal',
            'high'
        );
    }

    /**
     * Meta box callback
     */
    public function meta_box_callback($post)
    {
        wp_nonce_field('lean_forms_entry_meta', 'lean_forms_entry_nonce');

        $form_id = get_post_meta($post->ID, '_lf_form_id', true);
        $status = get_post_meta($post->ID, '_lf_status', true);
        $data = get_post_meta($post->ID, '_lf_data', true);
        $created = get_post_meta($post->ID, '_lf_created', true);
        $ip = get_post_meta($post->ID, '_lf_ip', true);
        $ua = get_post_meta($post->ID, '_lf_ua', true);

        if ($data) {
            $data = json_decode($data, true);
        }

        echo '<table class="form-table">';
        echo '<tr><th><label for="lf_form_id">' . __('Form ID', 'lean-forms') . '</label></th>';
        echo '<td><input type="number" id="lf_form_id" name="lf_form_id" value="' . esc_attr($form_id) . '" /></td></tr>';

        echo '<tr><th><label for="lf_status">' . __('Status', 'lean-forms') . '</label></th>';
        echo '<td><select id="lf_status" name="lf_status">';
        echo '<option value="new"' . selected($status, 'new', false) . '>' . __('New', 'lean-forms') . '</option>';
        echo '<option value="read"' . selected($status, 'read', false) . '>' . __('Read', 'lean-forms') . '</option>';
        echo '<option value="spam"' . selected($status, 'spam', false) . '>' . __('Spam', 'lean-forms') . '</option>';
        echo '</select></td></tr>';

        echo '<tr><th><label for="lf_created">' . __('Created', 'lean-forms') . '</label></th>';
        echo '<td><input type="text" id="lf_created" name="lf_created" value="' . esc_attr($created) . '" /></td></tr>';

        echo '<tr><th><label for="lf_ip">' . __('IP Address', 'lean-forms') . '</label></th>';
        echo '<td><input type="text" id="lf_ip" name="lf_ip" value="' . esc_attr($ip) . '" /></td></tr>';

        echo '<tr><th><label for="lf_ua">' . __('User Agent', 'lean-forms') . '</label></th>';
        echo '<td><textarea id="lf_ua" name="lf_ua" rows="2" cols="50">' . esc_textarea($ua) . '</textarea></td></tr>';

        if ($data && is_array($data)) {
            echo '<tr><th><label>' . __('Form Data', 'lean-forms') . '</label></th>';
            echo '<td><div style="max-height: 300px; overflow-y: auto; background: #f9f9f9; padding: 10px; border: 1px solid #ddd;">';
            echo '<pre>' . esc_html(json_encode($data, JSON_PRETTY_PRINT)) . '</pre>';
            echo '</div></td></tr>';
        }

        echo '</table>';
    }

    /**
     * Save meta data
     */
    public function save_meta($post_id)
    {
        if (
            !isset($_POST['lean_forms_entry_nonce']) ||
            !wp_verify_nonce($_POST['lean_forms_entry_nonce'], 'lean_forms_entry_meta')
        ) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $fields = ['lf_form_id', 'lf_status', 'lf_created', 'lf_ip', 'lf_ua'];

        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                $meta_key = '_lf_' . str_replace('lf_', '', $field);
                $value = sanitize_text_field($_POST[$field]);
                update_post_meta($post_id, $meta_key, $value);
            }
        }
    }

    /**
     * Sanitize status field
     */
    public function sanitize_status($value)
    {
        $allowed = ['new', 'read', 'spam'];
        return in_array($value, $allowed) ? $value : 'new';
    }

    /**
     * Sanitize JSON field
     */
    public function sanitize_json($value)
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return json_last_error() === JSON_ERROR_NONE ? $value : '';
        }
        return '';
    }
}
