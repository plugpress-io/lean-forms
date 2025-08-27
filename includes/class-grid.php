<?php

namespace Lean_Forms;

if (!defined('ABSPATH')) {
    exit;
}

class Grid
{
    public function __construct()
    {
        // Check if grid feature is enabled (default: enabled)
        if (!$this->is_grid_enabled()) {
            return;
        }

        add_filter('wpcf7_form_elements', [$this, 'process_cf7_shortcodes']);
        add_action('wpcf7_admin_init', [$this, 'add_tag_generators']);
        add_action('admin_enqueue_scripts', [$this, 'add_tag_generator_scripts']);
        add_action('wp_enqueue_scripts', [$this, 'maybe_enqueue_grid_css']);
    }

    /**
     * Check if grid feature is enabled
     */
    private function is_grid_enabled()
    {
        return get_option('lean_forms_enable_grid', true);
    }

    public function process_cf7_shortcodes($content)
    {
        // Process our custom shortcodes in CF7 forms
        $content = preg_replace_callback(
            '/\[lfcf7-row([^\]]*)\](.*?)\[\/lfcf7-row\]/s',
            [$this, 'row_shortcode_callback'],
            $content
        );

        $content = preg_replace_callback(
            '/\[lfcf7-col([^\]]*)\](.*?)\[\/lfcf7-col\]/s',
            [$this, 'col_shortcode_callback'],
            $content
        );

        return $content;
    }

    public function row_shortcode_callback($matches)
    {
        $atts_string = trim($matches[1]);
        $content = $matches[2];

        // Parse attributes from string like " gap:20 class:my-class"
        $atts = $this->parse_shortcode_atts($atts_string);
        $atts = array_merge([
            'gap' => '16',
            'class' => ''
        ], $atts);

        $gap = absint($atts['gap']);
        $class = sanitize_html_class($atts['class']);
        $style = "--lf-gap: {$gap}px;";
        $class_attr = $class ? " {$class}" : '';

        // Process inner content recursively
        $processed_content = $this->process_cf7_shortcodes($content);

        return sprintf(
            '<div class="lf-row%s" style="%s">%s</div>',
            $class_attr,
            esc_attr($style),
            $processed_content
        );
    }

    public function col_shortcode_callback($matches)
    {
        $atts_string = trim($matches[1]);
        $content = $matches[2];

        // Parse attributes from string like " col:8 sm:1 md:2 lg:5 xl:4 class:my-class"
        $atts = $this->parse_shortcode_atts($atts_string);
        $atts = array_merge([
            'col' => '12',
            'sm' => '',
            'md' => '',
            'lg' => '',
            'xl' => '',
            'class' => ''
        ], $atts);

        $col = absint($atts['col']);
        $data_attrs = "data-col=\"{$col}\"";
        foreach (['sm', 'md', 'lg', 'xl'] as $size) {
            if (!empty($atts[$size])) {
                $val = absint($atts[$size]);
                $data_attrs .= " data-{$size}=\"{$val}\"";
            }
        }
        $class = sanitize_html_class($atts['class']);
        $class_attr = $class ? " {$class}" : '';

        // Process inner content recursively
        $processed_content = $this->process_cf7_shortcodes($content);

        return sprintf(
            '<div class="lf-col%s" %s>%s</div>',
            $class_attr,
            $data_attrs,
            $processed_content
        );
    }

    private function parse_shortcode_atts($atts_string)
    {
        $atts = [];
        if (empty($atts_string)) {
            return $atts;
        }

        // Match both key:value and key="value" patterns
        preg_match_all('/(\w+)(?:[:=]([^"\s]+|"[^"]*"))?/', $atts_string, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $key = $match[1];
            $value = isset($match[2]) ? trim($match[2], '"') : '';
            $atts[$key] = $value;
        }

        return $atts;
    }

    public function add_tag_generators()
    {
        if (!class_exists('WPCF7_TagGenerator')) {
            return;
        }
        $tag_generator = \WPCF7_TagGenerator::get_instance();
        $tag_generator->add('lfcf7-row', __('Grid Row', 'lean-forms'), [$this, 'row_tag_generator']);
        $tag_generator->add('lfcf7-col', __('Grid Column', 'lean-forms'), [$this, 'col_tag_generator']);
    }

    public function row_tag_generator($contact_form, $args = '')
    {
        $args = wp_parse_args($args, []);
        $type = 'lfcf7-row';
        $description = __('Generate a grid row container.', 'lean-forms');
?>
        <div class="control-box">
            <fieldset>
                <legend><?php echo esc_html($description); ?></legend>
                <table class="form-table">
                    <tbody>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr($args['content'] . '-gap'); ?>">
                                    <?php esc_html_e('Gap (px)', 'lean-forms'); ?>
                                </label>
                            </th>
                            <td>
                                <input type="number" name="gap" id="<?php echo esc_attr($args['content'] . '-gap'); ?>" class="oneline option" value="16" min="0" max="100" />
                                <br />
                                <small><?php esc_html_e('Space between columns in pixels', 'lean-forms'); ?></small>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr($args['content'] . '-class'); ?>">
                                    <?php esc_html_e('CSS Class', 'lean-forms'); ?>
                                </label>
                            </th>
                            <td>
                                <input type="text" name="class" id="<?php echo esc_attr($args['content'] . '-class'); ?>" class="oneline option" />
                                <br />
                                <small><?php esc_html_e('Additional CSS classes (optional)', 'lean-forms'); ?></small>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
        </div>

        <div class="insert-box">
            <input type="text" name="<?php echo $type; ?>" class="tag code" readonly="readonly" onfocus="this.select()" />
            <div class="submitbox">
                <input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'lean-forms'); ?>">
                <br class="clear">
            </div>
        </div>
    <?php
    }

    public function col_tag_generator($contact_form, $args = '')
    {
        $args = wp_parse_args($args, []);
        $type = 'lfcf7-col';
        $description = __('Generate a grid column.', 'lean-forms');
    ?>
        <div class="control-box">
            <fieldset>
                <legend><?php echo esc_html($description); ?></legend>
                <table class="form-table">
                    <tbody>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr($args['content'] . '-col'); ?>">
                                    <?php esc_html_e('Base Width', 'lean-forms'); ?>
                                </label>
                            </th>
                            <td>
                                <select name="col" id="<?php echo esc_attr($args['content'] . '-col'); ?>" class="oneline option">
                                    <?php for ($i = 1; $i <= 12; $i++): ?>
                                        <option value="<?php echo $i; ?>" <?php selected($i, 12); ?>>
                                            <?php echo $i; ?>/12
                                        </option>
                                    <?php endfor; ?>
                                </select>
                                <br />
                                <small><?php esc_html_e('Default column width (1-12)', 'lean-forms'); ?></small>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr($args['content'] . '-sm'); ?>">
                                    <?php esc_html_e('Small (sm)', 'lean-forms'); ?>
                                </label>
                            </th>
                            <td>
                                <select name="sm" id="<?php echo esc_attr($args['content'] . '-sm'); ?>" class="oneline option">
                                    <option value=""><?php esc_html_e('Default', 'lean-forms'); ?></option>
                                    <?php for ($i = 1; $i <= 12; $i++): ?>
                                        <option value="<?php echo $i; ?>"><?php echo $i; ?>/12</option>
                                    <?php endfor; ?>
                                </select>
                                <br />
                                <small><?php esc_html_e('Width on small screens (≥576px)', 'lean-forms'); ?></small>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr($args['content'] . '-md'); ?>">
                                    <?php esc_html_e('Medium (md)', 'lean-forms'); ?>
                                </label>
                            </th>
                            <td>
                                <select name="md" id="<?php echo esc_attr($args['content'] . '-md'); ?>" class="oneline option">
                                    <option value=""><?php esc_html_e('Default', 'lean-forms'); ?></option>
                                    <?php for ($i = 1; $i <= 12; $i++): ?>
                                        <option value="<?php echo $i; ?>"><?php echo $i; ?>/12</option>
                                    <?php endfor; ?>
                                </select>
                                <br />
                                <small><?php esc_html_e('Width on medium screens (≥768px)', 'lean-forms'); ?></small>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr($args['content'] . '-lg'); ?>">
                                    <?php esc_html_e('Large (lg)', 'lean-forms'); ?>
                                </label>
                            </th>
                            <td>
                                <select name="lg" id="<?php echo esc_attr($args['content'] . '-lg'); ?>" class="oneline option">
                                    <option value=""><?php esc_html_e('Default', 'lean-forms'); ?></option>
                                    <?php for ($i = 1; $i <= 12; $i++): ?>
                                        <option value="<?php echo $i; ?>"><?php echo $i; ?>/12</option>
                                    <?php endfor; ?>
                                </select>
                                <br />
                                <small><?php esc_html_e('Width on large screens (≥992px)', 'lean-forms'); ?></small>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr($args['content'] . '-xl'); ?>">
                                    <?php esc_html_e('Extra Large (xl)', 'lean-forms'); ?>
                                </label>
                            </th>
                            <td>
                                <select name="xl" id="<?php echo esc_attr($args['content'] . '-xl'); ?>" class="oneline option">
                                    <option value=""><?php esc_html_e('Default', 'lean-forms'); ?></option>
                                    <?php for ($i = 1; $i <= 12; $i++): ?>
                                        <option value="<?php echo $i; ?>"><?php echo $i; ?>/12</option>
                                    <?php endfor; ?>
                                </select>
                                <br />
                                <small><?php esc_html_e('Width on extra large screens (≥1200px)', 'lean-forms'); ?></small>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="<?php echo esc_attr($args['content'] . '-class'); ?>">
                                    <?php esc_html_e('CSS Class', 'lean-forms'); ?>
                                </label>
                            </th>
                            <td>
                                <input type="text" name="class" id="<?php echo esc_attr($args['content'] . '-class'); ?>" class="oneline option" />
                                <br />
                                <small><?php esc_html_e('Additional CSS classes (optional)', 'lean-forms'); ?></small>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
        </div>

        <div class="insert-box">
            <input type="text" name="<?php echo $type; ?>" class="tag code" readonly="readonly" onfocus="this.select()" />
            <div class="submitbox">
                <input type="button" class="button button-primary insert-tag" value="<?php esc_attr_e('Insert Tag', 'lean-forms'); ?>">
                <br class="clear">
            </div>
        </div>
<?php
    }

    public function add_tag_generator_scripts()
    {
        if (!is_admin()) {
            return;
        }

        wp_enqueue_script(
            'lean-forms-cf7-editor',
            LEAN_FORMS_PLUGIN_URL . 'build/form-editor.js',
            ['jquery'],
            LEAN_FORMS_VERSION,
            true
        );
    }

    public function maybe_enqueue_grid_css()
    {
        // Only check if CF7 is active
        if (!function_exists('wpcf7_get_contact_forms')) {
            return;
        }

        // Check if any CF7 forms on this page use grid shortcodes
        if ($this->page_has_grid_shortcodes()) {
            wp_enqueue_style(
                'lean-forms-grid',
                LEAN_FORMS_PLUGIN_URL . 'build/grid.css',
                [],
                LEAN_FORMS_VERSION
            );
        }
    }

    private function page_has_grid_shortcodes()
    {
        global $post;

        // Check current post content
        if ($post && has_shortcode($post->post_content, 'contact-form-7')) {
            // Get all CF7 forms used on this page
            preg_match_all('/\[contact-form-7[^\]]*id="?(\d+)"?[^\]]*\]/', $post->post_content, $matches);

            if (!empty($matches[1])) {
                foreach ($matches[1] as $form_id) {
                    $form = \WPCF7_ContactForm::get_instance($form_id);
                    if ($form) {
                        $form_content = $form->prop('form');
                        if (strpos($form_content, '[lfcf7-row') !== false || strpos($form_content, '[lfcf7-col') !== false) {
                            return true;
                        }
                    }
                }
            }
        }

        // Also check widgets and other areas where CF7 might be used
        if (is_active_widget(false, false, 'text') || is_active_widget(false, false, 'custom_html')) {
            // For performance, we could cache this check
            $forms = wpcf7_get_contact_forms();
            foreach ($forms as $form) {
                $form_content = $form->prop('form');
                if (strpos($form_content, '[lfcf7-row') !== false || strpos($form_content, '[lfcf7-col') !== false) {
                    return true;
                }
            }
        }

        return false;
    }
}
