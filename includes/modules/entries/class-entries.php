<?php

/**
 * Entries Addon - Main Class
 * Manages form entries capture and custom post type
 *
 * @package Lean_Forms
 */

namespace Lean_Forms\features;

class Entries
{

    public function __construct()
    {
        // Load dependencies
        $this->load_dependencies();

        // Initialize components
        $this->init_components();
    }

    /**
     * Load required dependencies
     */
    private function load_dependencies()
    {
        $addon_dir = dirname(__FILE__);

        // Load CPT class first (required for entries)
        require_once $addon_dir . '/class-cpt.php';
    }

    /**
     * Initialize addon components
     */
    private function init_components()
    {
        // Initialize CPT first
        new \Lean_Forms\CPT();
    }
}
