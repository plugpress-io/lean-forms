<?php

/**
 * REST API Endpoints
 *
 * @package Lean_Forms
 */

namespace Lean_Forms;

class REST
{

    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    /**
     * Register REST routes
     */
    public function register_routes()
    {
        register_rest_route('lean-forms/v1', '/entries', [
            [
                'methods' => \WP_REST_Server::READABLE,
                'callback' => [$this, 'get_entries'],
                'permission_callback' => [$this, 'check_permissions'],
                'args' => $this->get_entries_args(),
            ],
        ]);

        register_rest_route('lean-forms/v1', '/entries/(?P<id>\d+)', [
            [
                'methods' => \WP_REST_Server::READABLE,
                'callback' => [$this, 'get_entry'],
                'permission_callback' => [$this, 'check_permissions'],
                'args' => [
                    'id' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param);
                        }
                    ],
                ],
            ],
            [
                'methods' => \WP_REST_Server::EDITABLE,
                'callback' => [$this, 'update_entry'],
                'permission_callback' => [$this, 'check_permissions'],
                'args' => [
                    'id' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param);
                        }
                    ],
                    'status' => [
                        'type' => 'string',
                        'enum' => ['new', 'read', 'spam'],
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                ],
            ],
            [
                'methods' => \WP_REST_Server::DELETABLE,
                'callback' => [$this, 'delete_entry'],
                'permission_callback' => [$this, 'check_permissions'],
                'args' => [
                    'id' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param);
                        }
                    ],
                ],
            ],
        ]);

        register_rest_route('lean-forms/v1', '/entries/export', [
            [
                'methods' => \WP_REST_Server::READABLE,
                'callback' => [$this, 'export_entries'],
                'permission_callback' => [$this, 'check_permissions'],
                'args' => $this->get_entries_args(),
            ],
        ]);

        register_rest_route('lean-forms/v1', '/settings', [
            [
                'methods' => \WP_REST_Server::READABLE,
                'callback' => [$this, 'get_settings'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
            [
                'methods' => \WP_REST_Server::EDITABLE,
                'callback' => [$this, 'update_settings'],
                'permission_callback' => [$this, 'check_permissions'],
                'args' => $this->get_settings_args(),
            ],
        ]);

        register_rest_route('lean-forms/v1', '/import-form', [
            [
                'methods' => \WP_REST_Server::CREATABLE,
                'callback' => [$this, 'import_form'],
                'permission_callback' => [$this, 'check_permissions'],
                'args' => [
                    'template_id' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'form_title' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'form_content' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'wp_kses_post',
                    ],
                    'mail_template' => [
                        'type' => 'object',
                        'default' => [],
                    ],
                ],
            ],
        ]);

        // Integration settings endpoints
        register_rest_route('lean-forms/v1', '/integration-settings/(?P<integration>[a-zA-Z0-9_-]+)', [
            [
                'methods' => \WP_REST_Server::READABLE,
                'callback' => [$this, 'get_integration_settings'],
                'permission_callback' => [$this, 'check_permissions'],
                'args' => [
                    'integration' => [
                        'validate_callback' => function ($param) {
                            return is_string($param) && preg_match('/^[a-zA-Z0-9_-]+$/', $param);
                        }
                    ],
                ],
            ],
            [
                'methods' => \WP_REST_Server::EDITABLE,
                'callback' => [$this, 'update_integration_settings'],
                'permission_callback' => [$this, 'check_permissions'],
                'args' => [
                    'integration' => [
                        'validate_callback' => function ($param) {
                            return is_string($param) && preg_match('/^[a-zA-Z0-9_-]+$/', $param);
                        }
                    ],
                ],
            ],
        ]);
    }

    /**
     * Check user permissions
     */
    public function check_permissions()
    {
        return current_user_can('manage_options');
    }

    /**
     * Get entries with filtering and pagination
     */
    public function get_entries($request)
    {
        $args = $this->prepare_query_args($request);

        $query = new \WP_Query($args);
        $entries = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $entries[] = $this->format_entry(get_post());
            }
        }

        wp_reset_postdata();

        return [
            'items' => $entries,
            'total' => $query->found_posts,
            'pages' => $query->max_num_pages,
            'current_page' => $args['paged'],
            'per_page' => $args['posts_per_page'],
        ];
    }

    /**
     * Get single entry
     */
    public function get_entry($request)
    {
        $entry_id = $request['id'];
        $entry = get_post($entry_id);

        if (!$entry || $entry->post_type !== 'lean_forms_entry') {
            return new \WP_Error('entry_not_found', __('Entry not found', 'lean-forms'), ['status' => 404]);
        }

        return $this->format_entry($entry);
    }

    /**
     * Update entry status
     */
    public function update_entry($request)
    {
        $entry_id = $request['id'];
        $status = $request['status'];

        $result = update_post_meta($entry_id, '_lf_status', $status);

        if ($result === false) {
            return new \WP_Error('update_failed', __('Failed to update entry', 'lean-forms'), ['status' => 500]);
        }

        return [
            'success' => true,
            'message' => __('Entry updated successfully', 'lean-forms'),
        ];
    }

    /**
     * Delete entry (move to trash)
     */
    public function delete_entry($request)
    {
        $entry_id = $request['id'];

        $result = wp_trash_post($entry_id);

        if (!$result) {
            return new \WP_Error('delete_failed', __('Failed to delete entry', 'lean-forms'), ['status' => 500]);
        }

        return [
            'success' => true,
            'message' => __('Entry deleted successfully', 'lean-forms'),
        ];
    }

    /**
     * Export entries as CSV
     */
    public function export_entries($request)
    {
        $args = $this->prepare_query_args($request);

        // Limit export to 500 rows for Lite version
        $args['posts_per_page'] = min(500, $args['posts_per_page']);
        $args['nopaging'] = false;

        $query = new \WP_Query($args);

        if (!$query->have_posts()) {
            return new \WP_Error('no_entries', __('No entries found for export', 'lean-forms'), ['status' => 404]);
        }

        // Set headers for CSV download
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=lean-forms-entries-' . date('Y-m-d') . '.csv');

        // Create output stream
        $output = fopen('php://output', 'w');

        // Add BOM for UTF-8
        fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

        // CSV headers
        $headers = ['ID', 'Form ID', 'Status', 'Created', 'IP Address', 'User Agent'];
        fputcsv($output, $headers);

        // Add data rows
        while ($query->have_posts()) {
            $query->the_post();
            $entry = $this->format_entry(get_post());

            $row = [
                $entry['id'],
                $entry['form_id'],
                $entry['status'],
                $entry['created'],
                $entry['ip'],
                $entry['user_agent'],
            ];

            fputcsv($output, $row);
        }

        wp_reset_postdata();
        fclose($output);
        exit;
    }

    /**
     * Prepare WP_Query arguments
     */
    private function prepare_query_args($request)
    {
        $args = [
            'post_type' => 'lean_forms_entry',
            'post_status' => 'publish',
            'posts_per_page' => min(50, (int) ($request['per_page'] ?? 20)),
            'paged' => max(1, (int) ($request['page'] ?? 1)),
            'orderby' => 'date',
            'order' => 'DESC',
            'meta_query' => [],
        ];

        // Search
        if (!empty($request['search'])) {
            $args['s'] = sanitize_text_field($request['search']);
        }

        // Status filter
        if (!empty($request['status']) && in_array($request['status'], ['new', 'read', 'spam'])) {
            $args['meta_query'][] = [
                'key' => '_lf_status',
                'value' => $request['status'],
                'compare' => '=',
            ];
        }

        // Form ID filter
        if (!empty($request['form_id'])) {
            $args['meta_query'][] = [
                'key' => '_lf_form_id',
                'value' => (int) $request['form_id'],
                'compare' => '=',
            ];
        }

        // Date range filter
        if (!empty($request['date_min']) || !empty($request['date_max'])) {
            $date_query = [];

            if (!empty($request['date_min'])) {
                $date_query['after'] = sanitize_text_field($request['date_min']);
            }

            if (!empty($request['date_max'])) {
                $date_query['before'] = sanitize_text_field($request['date_max']);
            }

            if (!empty($date_query)) {
                $args['date_query'] = [$date_query];
            }
        }

        return $args;
    }

    /**
     * Format entry for API response
     */
    private function format_entry($post)
    {
        $form_id = get_post_meta($post->ID, '_lf_form_id', true);
        $status = get_post_meta($post->ID, '_lf_status', true);
        $data = get_post_meta($post->ID, '_lf_data', true);
        $created = get_post_meta($post->ID, '_lf_created', true);
        $ip = get_post_meta($post->ID, '_lf_ip', true);
        $ua = get_post_meta($post->ID, '_lf_ua', true);

        return [
            'id' => $post->ID,
            'title' => $post->post_title,
            'form_id' => (int) $form_id,
            'status' => $status ?: 'new',
            'data' => $data ? json_decode($data, true) : [],
            'created' => $created,
            'ip' => $ip,
            'user_agent' => $ua,
            'date' => get_the_date('c', $post->ID),
            'modified' => get_the_modified_date('c', $post->ID),
        ];
    }

    /**
     * Get entries endpoint arguments
     */
    private function get_entries_args()
    {
        return [
            'page' => [
                'description' => __('Current page of the collection.', 'lean-forms'),
                'type' => 'integer',
                'default' => 1,
                'minimum' => 1,
                'sanitize_callback' => 'absint',
            ],
            'per_page' => [
                'description' => __('Maximum number of items to be returned in result set.', 'lean-forms'),
                'type' => 'integer',
                'default' => 20,
                'minimum' => 1,
                'maximum' => 100,
                'sanitize_callback' => 'absint',
            ],
            'search' => [
                'description' => __('Limit results to those matching a string.', 'lean-forms'),
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'status' => [
                'description' => __('Limit result set to entries with specific status.', 'lean-forms'),
                'type' => 'string',
                'enum' => ['new', 'read', 'spam'],
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'form_id' => [
                'description' => __('Limit result set to entries from a specific form.', 'lean-forms'),
                'type' => 'integer',
                'sanitize_callback' => 'absint',
            ],
            'date_min' => [
                'description' => __('Limit result set to entries created after a given ISO8601 compliant date.', 'lean-forms'),
                'type' => 'string',
                'format' => 'date-time',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'date_max' => [
                'description' => __('Limit result set to entries created before a given ISO8601 compliant date.', 'lean-forms'),
                'type' => 'string',
                'format' => 'date-time',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ];
    }

    /**
     * Get settings args for REST API
     */
    private function get_settings_args()
    {
        $settings = $this->get_all_settings();
        $args = [];

        foreach (array_keys($settings) as $setting) {
            $args[$setting] = [
                'type' => 'boolean',
                'sanitize_callback' => 'rest_sanitize_boolean',
            ];
        }

        return $args;
    }

    /**
     * Get default features configuration
     */
    private function get_default_features()
    {
        return [
            // Lite addons (enabled by default)
            'grid' => true,
            'entries' => true,
            'form_presets' => true,
            'spam_protection' => false,
            'divi' => false,
            'bricks' => false,
            'block' => false,
            'elementor' => false,
            // Pro addons (disabled by default)
            'rating_field' => false,
            'range_slider_field' => false,
            'signature_field' => false,
            'color_picker_field' => false,
            'divider_field' => false,
            'multi_steps' => false,
            'conditional_logic' => false,
            'google_sheets' => false,
            'mailchimp' => false,
            'emailoctopus' => false,
            'airtable' => false,
        ];
    }

    /**
     * Get all addon settings
     */
    private function get_all_settings()
    {
        // Get the unified features option with defaults
        $enabled_features = get_option('lean_forms_enabled_features', $this->get_default_features());

        // Convert to frontend format
        $settings = [];
        foreach ($enabled_features as $feature_key => $value) {
            $option_name = 'lean_forms_enable_' . $feature_key;
            $settings[$option_name] = $value;
        }

        return $settings;
    }

    /**
     * Get settings
     */
    public function get_settings($request)
    {
        // Simply return the processed settings from get_all_settings
        // which already converts the unified option to individual format
        $settings = $this->get_all_settings();

        return rest_ensure_response($settings);
    }

    /**
     * Update settings
     */
    public function update_settings($request)
    {
        $valid_settings = array_keys($this->get_all_settings());
        $updated = [];
        $features_updated = false;

        // Get current unified features option with proper defaults
        $enabled_features = get_option('lean_forms_enabled_features', $this->get_default_features());

        foreach ($valid_settings as $setting) {
            if ($request->has_param($setting)) {
                $value = $request->get_param($setting);

                // Extract feature key from setting name (e.g., 'lean_forms_enable_multi_steps' -> 'multi_steps')
                if (strpos($setting, 'lean_forms_enable_') === 0) {
                    $feature_key = str_replace('lean_forms_enable_', '', $setting);

                    // Update unified option
                    $enabled_features[$feature_key] = (bool) $value;
                    $features_updated = true;

                    $updated[$setting] = $value;
                }
            }
        }

        // Save unified option if any features were updated
        if ($features_updated) {
            update_option('lean_forms_enabled_features', $enabled_features);
        }

        // Return success response with updated settings
        return rest_ensure_response([
            'success' => true,
            'message' => __('Settings updated successfully', 'lean-forms'),
            'updated' => $updated,
            'settings' => $this->get_settings($request)->get_data(),
        ]);
    }

    /**
     * Import Contact Form 7 template
     */
    public function import_form($request)
    {
        // Check if Contact Form 7 is active
        if (!class_exists('WPCF7_ContactForm')) {
            return new \WP_Error(
                'cf7_not_active',
                __('Contact Form 7 plugin is not active', 'lean-forms'),
                ['status' => 400]
            );
        }

        $template_id = $request->get_param('template_id');
        $form_title = $request->get_param('form_title');
        $form_content = $request->get_param('form_content');
        $mail_template = $request->get_param('mail_template') ?: [];

        try {
            // Create new Contact Form 7 form
            $contact_form = \WPCF7_ContactForm::get_template();

            // Set form title
            $contact_form->set_title($form_title);

            // Set form content
            $contact_form->set_prop('form', $form_content);

            // Set mail template if provided
            if (!empty($mail_template)) {
                $mail = $contact_form->prop('mail');

                if (isset($mail_template['subject'])) {
                    $mail['subject'] = $mail_template['subject'];
                }

                if (isset($mail_template['body'])) {
                    $mail['body'] = $mail_template['body'];
                }

                $contact_form->set_prop('mail', $mail);
            }

            // Save the form
            $form_id = $contact_form->save();

            if (!$form_id) {
                throw new \Exception(__('Failed to create Contact Form 7 form', 'lean-forms'));
            }

            // Return success response
            return rest_ensure_response([
                'success' => true,
                'message' => __('Form template imported successfully', 'lean-forms'),
                'form_id' => $form_id,
                'template_id' => $template_id,
                'edit_url' => admin_url("admin.php?page=wpcf7&post={$form_id}&action=edit"),
            ]);
        } catch (\Exception $e) {
            return new \WP_Error(
                'import_failed',
                $e->getMessage(),
                ['status' => 500]
            );
        }
    }

    /**
     * Get integration settings
     */
    public function get_integration_settings($request)
    {
        $integration = $request->get_param('integration');

        if (!$integration) {
            return new \WP_Error(
                'invalid_integration',
                __('Invalid integration specified', 'lean-forms'),
                ['status' => 400]
            );
        }

        $option_name = "lean_forms_integration_{$integration}";
        $settings = get_option($option_name, []);

        return rest_ensure_response([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Update integration settings
     */
    public function update_integration_settings($request)
    {
        $integration = $request->get_param('integration');

        if (!$integration) {
            return new \WP_Error(
                'invalid_integration',
                __('Invalid integration specified', 'lean-forms'),
                ['status' => 400]
            );
        }

        // Get request body
        $body = $request->get_json_params();
        if (!$body) {
            $body = $request->get_body_params();
        }

        // Sanitize settings
        $settings = [];
        if (is_array($body)) {
            foreach ($body as $key => $value) {
                // Only allow specific keys for security
                if (in_array($key, ['api_key', 'client_id', 'client_secret', 'spreadsheet_id', 'list_id', 'audience_id', 'base_id', 'table_name'])) {
                    $settings[sanitize_key($key)] = sanitize_text_field($value);
                }
            }
        }

        $option_name = "lean_forms_integration_{$integration}";
        $updated = update_option($option_name, $settings);

        if ($updated !== false) {
            return rest_ensure_response([
                'success' => true,
                'message' => __('Integration settings updated successfully', 'lean-forms'),
                'data' => $settings,
            ]);
        } else {
            return new \WP_Error(
                'update_failed',
                __('Failed to update integration settings', 'lean-forms'),
                ['status' => 500]
            );
        }
    }
}
