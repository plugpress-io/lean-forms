<?php

namespace Lean_Forms;

class Capture
{

    public function __construct()
    {
        add_action('wpcf7_before_send_mail', [$this, 'capture_submission']);
    }

    /**
     * Capture form submission before sending mail
     */
    public function capture_submission($cf7)
    {
        $submission = \WPCF7_Submission::get_instance();

        if (!$submission) {
            return;
        }

        $data = $submission->get_posted_data();
        $files = $submission->get_uploaded_files();

        // Skip if this is a spam submission
        if ($submission->is_spam()) {
            $this->save_entry($cf7, $data, $files, 'spam');
            return;
        }

        // Save as new entry
        $this->save_entry($cf7, $data, $files, 'new');
    }

    /**
     * Save form entry to database
     */
    private function save_entry($cf7, $data, $files, $status)
    {
        // Get form ID
        $form_id = $cf7->id();

        // Sanitize and prepare payload
        $payload = $this->prepare_payload($data, $files);

        // Apply filter for custom modifications
        $payload = apply_filters('lean_forms_entry_payload', $payload, $cf7);

        // Create post title
        $title = sprintf(
            __('Entry #%d — %s', 'lean-forms'),
            time(), // We'll update this with the actual post ID
            current_time('Y-m-d H:i:s')
        );

        // Insert post
        $post_data = [
            'post_title'   => $title,
            'post_content' => '',
            'post_status'  => 'publish',
            'post_type'    => 'lean_forms_entry',
            'post_author'  => 1, // Default author
        ];

        $post_id = wp_insert_post($post_data);

        if (is_wp_error($post_id)) {
            return;
        }

        // Update title with actual post ID
        wp_update_post([
            'ID' => $post_id,
            'post_title' => sprintf(
                __('Entry #%d — %s', 'lean-forms'),
                $post_id,
                current_time('Y-m-d H:i:s')
            )
        ]);

        // Save meta data
        update_post_meta($post_id, '_lf_form_id', $form_id);
        update_post_meta($post_id, '_lf_status', $status);
        update_post_meta($post_id, '_lf_data', json_encode($payload));
        update_post_meta($post_id, '_lf_created', current_time('mysql'));
        update_post_meta($post_id, '_lf_ip', $this->get_client_ip());
        update_post_meta($post_id, '_lf_ua', $this->get_user_agent());
    }

    /**
     * Prepare payload data, removing sensitive information
     */
    private function prepare_payload($data, $files)
    {
        $payload = [];

        // Process form data
        foreach ($data as $key => $value) {
            // Skip sensitive fields
            if ($this->is_sensitive_field($key)) {
                continue;
            }

            // Sanitize value
            if (is_array($value)) {
                $payload[$key] = array_map('sanitize_text_field', $value);
            } else {
                $payload[$key] = sanitize_text_field($value);
            }
        }

        // Process uploaded files (only store names, not content)
        if (!empty($files)) {
            foreach ($files as $key => $file) {
                if (is_array($file)) {
                    $payload[$key] = array_map(function ($f) {
                        return basename($f);
                    }, $file);
                } else {
                    $payload[$key] = basename($file);
                }
            }
        }

        return $payload;
    }

    /**
     * Check if a field name contains sensitive information
     */
    private function is_sensitive_field($field_name)
    {
        $sensitive_patterns = [
            'password',
            'card',
            'credit',
            'cvv',
            'cvc',
            'ssn',
            'social',
            'secret',
            'token',
            'key',
            'auth',
            'login',
            'signin'
        ];

        $field_lower = strtolower($field_name);

        foreach ($sensitive_patterns as $pattern) {
            if (strpos($field_lower, $pattern) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get client IP address
     */
    private function get_client_ip()
    {
        $ip_keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];

        foreach ($ip_keys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                        return $ip;
                    }
                }
            }
        }

        return $_SERVER['REMOTE_ADDR'] ?? '';
    }

    /**
     * Get user agent string
     */
    private function get_user_agent()
    {
        return $_SERVER['HTTP_USER_AGENT'] ?? '';
    }
}
