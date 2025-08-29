<?php

namespace Lean_Forms;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Base class for all CF7-related metaboxes
 */
abstract class CF7_Metabox
{
    /**
     * Metabox ID (must be unique)
     */
    protected $metabox_id = 'lean-forms-cf7-base';

    /**
     * Metabox title
     */
    protected $metabox_title = 'CF7 Configuration';

    /**
     * Meta key for storing data
     */
    protected $meta_key = '_lean_forms_cf7_base';

    /**
     * Nonce action
     */
    protected $nonce_action = 'lean_forms_cf7_base_nonce';

    /**
     * Constructor
     */
    public function __construct()
    {
        // Add metabox to CF7 forms
        add_action('add_meta_boxes', [$this, 'add_metabox']);
        add_action('save_post', [$this, 'save_meta']);

        // Enqueue admin assets
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
    }

    /**
     * Add CF7 metabox for form configuration
     */
    public function add_metabox()
    {
        add_meta_box(
            'lean-forms-cf7-metabox',
            'Form Configuration',
            [$this, 'render_cf7_metabox'],
            'wpcf7_contact_form',
            'advanced',
            'high'
        );
    }

    /**
     * Render the metabox (abstract method - must be implemented by child classes)
     */
    abstract public function render_metabox($post);

    /**
     * Save meta data (abstract method - must be implemented by child classes)
     */
    abstract public function save_meta($post_id);

    /**
     * Get meta data for a form
     */
    protected function get_form_meta($post_id, $default = [])
    {
        return get_post_meta($post_id, $this->meta_key, true) ?: $default;
    }

    /**
     * Update meta data for a form
     */
    protected function update_form_meta($post_id, $data)
    {
        return update_post_meta($post_id, $this->meta_key, $data);
    }

    /**
     * Verify nonce
     */
    protected function verify_nonce()
    {
        return wp_verify_nonce(
            $_POST[$this->nonce_action] ?? '',
            $this->nonce_action
        );
    }

    /**
     * Add nonce field to metabox
     */
    protected function add_nonce_field()
    {
        wp_nonce_field($this->nonce_action, $this->nonce_action);
    }

    /**
     * Check if user can edit the post
     */
    protected function can_edit_post($post_id)
    {
        return current_user_can('edit_post', $post_id);
    }

    /**
     * Check if this is an autosave
     */
    protected function is_autosave()
    {
        return defined('DOING_AUTOSAVE') && DOING_AUTOSAVE;
    }

    /**
     * Enqueue admin assets (can be overridden by child classes)
     */
    public function enqueue_admin_assets($hook)
    {
        // Base implementation - child classes can override
    }

    /**
     * Get all CF7 forms on current page
     */
    protected function get_cf7_forms_on_page()
    {
        global $post;

        if (!$post || !has_shortcode($post->post_content, 'contact-form-7')) {
            return [];
        }

        preg_match_all('/\[contact-form-7[^\]]*id="?(\d+)"?[^\]]*\]/', $post->post_content, $matches);

        return $matches[1] ?? [];
    }

    /**
     * Check if current page has CF7 forms
     */
    protected function page_has_cf7_forms()
    {
        return !empty($this->get_cf7_forms_on_page());
    }
}
