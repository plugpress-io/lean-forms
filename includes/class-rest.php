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
     * Get all addon settings
     */
    private function get_all_settings()
    {
        return [
            // Lite addons
            'lean_forms_enable_grid' => true,
            'lean_forms_enable_entries' => true,
            'lean_forms_enable_spam_protection' => false,
            'lean_forms_enable_divi' => false,
            'lean_forms_enable_bricks' => false,
            'lean_forms_enable_block' => false,
            'lean_forms_enable_elementor' => false,
            // Pro addons
            'lean_forms_enable_rating_field' => false,
            'lean_forms_enable_range_slider_field' => false,
            'lean_forms_enable_signature_field' => false,
            'lean_forms_enable_color_picker_field' => false,
            'lean_forms_enable_divider_field' => false,
            'lean_forms_enable_multi_steps' => false,
            'lean_forms_enable_conditional_logic' => false,
            'lean_forms_enable_google_sheets' => false,
            'lean_forms_enable_mailchimp' => false,
            'lean_forms_enable_emailoctopus' => false,
            'lean_forms_enable_airtable' => false,
        ];
    }

    /**
     * Get settings
     */
    public function get_settings($request)
    {
        $default_settings = $this->get_all_settings();
        $settings = [];

        foreach ($default_settings as $setting => $default) {
            $settings[$setting] = get_option($setting, $default);
        }

        return rest_ensure_response($settings);
    }

    /**
     * Update settings
     */
    public function update_settings($request)
    {
        $valid_settings = array_keys($this->get_all_settings());
        $updated = [];

        foreach ($valid_settings as $setting) {
            if ($request->has_param($setting)) {
                $value = $request->get_param($setting);
                $result = update_option($setting, $value);
                if ($result !== false) {
                    $updated[$setting] = $value;
                }
            }
        }

        // Return success response with updated settings
        return rest_ensure_response([
            'success' => true,
            'message' => __('Settings updated successfully', 'lean-forms'),
            'updated' => $updated,
            'settings' => $this->get_settings($request)->get_data(),
        ]);
    }
}
