<?php

/**
 * Plugin Name: Lean Forms
 * Plugin URI: https://plugpress.io/lean-forms
 * Description: Lightweight power-ups for Contact Form 7. Do more, no bloat.
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

/**
 * Main Lean Forms Plugin Class
 */
class Lean_Forms
{

    /**
     * Single instance of the class
     */
    private static $_instance = null;

    /**
     * Get instance
     */
    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Constructor
     */
    private function __construct()
    {
        $this->init_hooks();
    }

    /**
     * Initialize hooks
     */
    private function init_hooks()
    {
        add_action('init', [$this, 'init']);
        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);
    }

    /**
     * Initialize the plugin
     */
    public function init()
    {
        // Load text domain
        load_plugin_textdomain('lean-forms', false, dirname(plugin_basename(__FILE__)) . '/languages');

        // Include required files
        require_once LEAN_FORMS_PLUGIN_DIR . 'includes/class-admin.php';
        require_once LEAN_FORMS_PLUGIN_DIR . 'includes/class-rest.php';
        require_once LEAN_FORMS_PLUGIN_DIR . 'includes/class-utils.php';
        require_once LEAN_FORMS_PLUGIN_DIR . 'includes/class-cf7-metabox.php';
        require_once LEAN_FORMS_PLUGIN_DIR . 'includes/class-modules.php';

        // Initialize components
        new \Lean_Forms\Admin();
        new \Lean_Forms\REST();
        new \Lean_Forms\Modules();
    }

    /**
     * Plugin activation
     */
    public function activate()
    {
        add_option('lean_forms_version', LEAN_FORMS_VERSION);
        // Flush rewrite rules for CPT
        flush_rewrite_rules();
    }

    /**
     * Plugin deactivation
     */
    public function deactivate()
    {
        // Flush rewrite rules
        flush_rewrite_rules();
    }
}

// Kick start the plugin with a function
function lean_forms_init()
{
    Lean_Forms::instance();
}
lean_forms_init();
