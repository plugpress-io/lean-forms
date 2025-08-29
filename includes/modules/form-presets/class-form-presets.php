<?php

namespace Lean_Forms\Modules;

if (!defined('ABSPATH')) {
    exit;
}

class Form_Presets extends \Lean_Forms\CF7_Metabox
{
    /**
     * Constructor
     */
    public function __construct()
    {
        // Set metabox properties
        $this->metabox_id = 'lean-forms-cf7-presets';
        $this->metabox_title = 'Form Presets';
        $this->meta_key = '_lean_forms_cf7_presets';
        $this->nonce_action = 'lean_forms_cf7_presets_nonce';

        // Call parent constructor (sets up hooks)
        parent::__construct();

        // Enqueue frontend styles
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_styles']);
    }

    /**
     * Get available style presets
     */
    private function get_style_presets()
    {
        return [
            'classic' => [
                'name' => 'Classic',
                'description' => 'Traditional, professional look',
                'defaults' => [
                    'primary_color' => '#0073aa',
                    'placeholder_color' => '#666666',
                    'button_color' => '#ffffff',
                    'primary_bg_color' => '#ffffff',
                    'input_bg_color' => '#ffffff',
                    'button_bg_color' => '#0073aa',
                    'label_font_size' => 14,
                    'h1_font_size' => 24,
                    'h2_font_size' => 20,
                    'h3_font_size' => 18,
                    'p_font_size' => 16,
                ]
            ],
            'modern' => [
                'name' => 'Modern',
                'description' => 'Contemporary design with shadows',
                'defaults' => [
                    'primary_color' => '#2563eb',
                    'placeholder_color' => '#9ca3af',
                    'button_color' => '#ffffff',
                    'primary_bg_color' => '#f8fafc',
                    'input_bg_color' => '#ffffff',
                    'button_bg_color' => '#2563eb',
                    'label_font_size' => 13,
                    'h1_font_size' => 28,
                    'h2_font_size' => 22,
                    'h3_font_size' => 18,
                    'p_font_size' => 15,
                ]
            ]
        ];
    }

    /**
     * Render the metabox (required by abstract class)
     */
    public function render_metabox($post)
    {
        $styling = $this->get_form_meta($post->ID, []);
        $presets = $this->get_style_presets();

        $current_preset = $styling['preset'] ?? 'classic';
        $custom_options = $styling['custom_options'] ?? [];

        // Merge preset defaults with custom options
        $current_options = array_merge($presets[$current_preset]['defaults'], $custom_options);

        // Add nonce for security
        $this->add_nonce_field();
?>

        <div id="lean-forms-preset-app"
            data-preset="<?php echo esc_attr($current_preset); ?>"
            data-options='<?php echo json_encode($current_options); ?>'>
            <!-- React app will render here -->
        </div>

<?php
    }

    /**
     * Save meta data (required by abstract class)
     */
    public function save_meta($post_id)
    {
        // Security checks
        if ($this->is_autosave()) return;
        if (!$this->can_edit_post($post_id)) return;
        if (!$this->verify_nonce()) return;

        $styling = [
            'preset' => sanitize_text_field($_POST['lean_forms_preset'] ?? 'classic'),
            'custom_options' => [
                'primary_color' => sanitize_hex_color($_POST['lean_forms_primary_color'] ?? '#0073aa'),
                'placeholder_color' => sanitize_hex_color($_POST['lean_forms_placeholder_color'] ?? '#666666'),
                'button_color' => sanitize_hex_color($_POST['lean_forms_button_color'] ?? '#ffffff'),
                'primary_bg_color' => sanitize_hex_color($_POST['lean_forms_primary_bg_color'] ?? '#ffffff'),
                'input_bg_color' => sanitize_hex_color($_POST['lean_forms_input_bg_color'] ?? '#ffffff'),
                'button_bg_color' => sanitize_hex_color($_POST['lean_forms_button_bg_color'] ?? '#0073aa'),
                'label_font_size' => absint($_POST['lean_forms_label_font_size'] ?? 14),
                'h1_font_size' => absint($_POST['lean_forms_h1_font_size'] ?? 24),
                'h2_font_size' => absint($_POST['lean_forms_h2_font_size'] ?? 20),
                'h3_font_size' => absint($_POST['lean_forms_h3_font_size'] ?? 18),
                'p_font_size' => absint($_POST['lean_forms_p_font_size'] ?? 16),
            ]
        ];

        $this->update_form_meta($post_id, $styling);
    }

    /**
     * Enqueue admin assets (overrides parent method)
     */
    public function enqueue_admin_assets($hook)
    {
        global $post_type;

        if ($post_type !== 'wpcf7_contact_form') {
            return;
        }

        wp_enqueue_script(
            'lean-forms-preset-admin',
            LEAN_FORMS_PLUGIN_URL . 'build/form-preset-admin.js',
            ['wp-element', 'wp-components'],
            LEAN_FORMS_VERSION,
            true
        );

        wp_enqueue_style(
            'lean-forms-preset-admin',
            LEAN_FORMS_PLUGIN_URL . 'build/form-preset-admin.css',
            [],
            LEAN_FORMS_VERSION
        );

        // Localize script with data
        wp_localize_script('lean-forms-preset-admin', 'leanFormsPreset', [
            'presets' => $this->get_style_presets(),
            'nonce' => wp_create_nonce('lean_forms_styling_nonce'),
        ]);
    }

    /**
     * Enqueue frontend styles
     */
    public function enqueue_frontend_styles()
    {
        // Get all CF7 forms on current page
        global $post;

        if ($post && has_shortcode($post->post_content, 'contact-form-7')) {
            preg_match_all('/\[contact-form-7[^\]]*id="?(\d+)"?[^\]]*\]/', $post->post_content, $matches);

            if (!empty($matches[1])) {
                $custom_css = '';

                foreach ($matches[1] as $form_id) {
                    $styling = get_post_meta($form_id, $this->meta_key, true);

                    if ($styling) {
                        $custom_css .= $this->generate_form_css($form_id, $styling);
                    }
                }

                if ($custom_css) {
                    wp_add_inline_style('lean-forms-grid', $custom_css);
                }
            }
        }
    }

    /**
     * Generate CSS for a specific form
     */
    private function generate_form_css($form_id, $styling)
    {
        $preset = $styling['preset'] ?? 'classic';
        $custom_options = $styling['custom_options'] ?? [];

        // Get preset defaults
        $presets = $this->get_style_presets();
        $preset_defaults = $presets[$preset]['defaults'];

        // Merge custom options with preset defaults
        $options = array_merge($preset_defaults, $custom_options);

        // Generate CSS variables
        $css_vars = "
            --lf-primary-color: {$options['primary_color']};
            --lf-placeholder-color: {$options['placeholder_color']};
            --lf-button-color: {$options['button_color']};
            --lf-primary-bg-color: {$options['primary_bg_color']};
            --lf-input-bg-color: {$options['input_bg_color']};
            --lf-button-bg-color: {$options['button_bg_color']};
            --lf-label-font-size: {$options['label_font_size']}px;
            --lf-h1-font-size: {$options['h1_font_size']}px;
            --lf-h2-font-size: {$options['h2_font_size']}px;
            --lf-h3-font-size: {$options['h3_font_size']}px;
            --lf-p-font-size: {$options['p_font_size']}px;
        ";

        return "
            .wpcf7-form-{$form_id} {
                {$css_vars}
            }
            
            .wpcf7-form-{$form_id} {
                @extend .lean-forms-preset-{$preset};
            }
        ";
    }
}
