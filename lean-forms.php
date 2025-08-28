<?php

/**
 * Plugin Name: Lean Forms
 * Plugin URI: https://plugpress.io/lean-forms
 * Description: Integrates with Contact Form 7 (CF7). Not affiliated or endorsed. Collects form submissions, provides admin interface, and offers form styling blocks.
 * Version: 1.0.0
 * Author: PlugPress
 * Text Domain: lean-forms
 * Domain Path: /languages
 * Requires at least: 6.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 *
 * @package Lean_Forms
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('LEAN_FORMS_VERSION', '1.0.0');
define('LEAN_FORMS_PLUGIN_FILE', __FILE__);
define('LEAN_FORMS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('LEAN_FORMS_PLUGIN_URL', plugin_dir_url(__FILE__));

// Initialize plugin
function lean_forms_init()
{
    // Load text domain
    load_plugin_textdomain('lean-forms', false, dirname(plugin_basename(__FILE__)) . '/languages');

    // Include required files
    require_once LEAN_FORMS_PLUGIN_DIR . 'includes/class-cpt.php';
    require_once LEAN_FORMS_PLUGIN_DIR . 'includes/class-capture.php';
    require_once LEAN_FORMS_PLUGIN_DIR . 'includes/class-admin.php';
    require_once LEAN_FORMS_PLUGIN_DIR . 'includes/class-rest.php';
    require_once LEAN_FORMS_PLUGIN_DIR . 'includes/class-utils.php';
    require_once LEAN_FORMS_PLUGIN_DIR . 'includes/class-grid.php';

    // Initialize components
    new \Lean_Forms\CPT();
    new \Lean_Forms\Capture();
    new \Lean_Forms\Admin();
    new \Lean_Forms\REST();
    new \Lean_Forms\Grid();
}
add_action('init', 'lean_forms_init');

// Activation hook
register_activation_hook(__FILE__, function () {
    // Flush rewrite rules for CPT
    flush_rewrite_rules();
});

// Deactivation hook
register_deactivation_hook(__FILE__, function () {
    // Flush rewrite rules
    flush_rewrite_rules();
});

// Note: Frontend CSS is now conditionally loaded by the Grid class when needed
