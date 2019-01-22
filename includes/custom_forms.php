<?php namespace AS_Custom_Forms;

/**
 * Awesome Support Custom Forms
 *
 */
class CustomForms 
{
    private static $instance = null;

    private function __construct() {

        // Load language
        load_plugin_textdomain( 'as-custom-forms', false, dirname( __FILE__ ) . '/languages' );

        // Register post type 
        add_action( 'init', 'ascf_register_post_type' );

        // Register dynamic blocks 
        add_action( 'admin_init', 'ascf_register_dynamic_blocks');

        /**
         * Filter Custom fields list
         * Get only user defined fields from API
         */ 
        add_filter( 'wpas_api_custom_fields_filter', 'ascf_api_custom_fields_filter' );

    }

    /**
     * Get instance
     *
     * @return CustomForms
     * @since 1.0.0
     */
    public static function get_instance() {

        if ( is_null( static::$instance ) ) {
            static::$instance = new self;
        }

        return static::$instance;

    }

    /**
     * Run Custom Forms actions 
     *
     * @return void
     */
    public function run() {

        add_action( 'init', [ 
            $this, is_admin() ? 'backend' : 'frontend' 
        ] );

    }


    /**
     * Custom Forms frontend actions
     *
     * @return void
     */
    public function frontend() {

         // Enqueue frontend assets
        add_action( 'enqueue_block_assets', 'ascf_enqueue_frontend_assets' );


    }

    /**
     * Custom Forms backend actions
     *
     * @return void
     */
    public function backend() {

        // Enqueue backend assets
        add_action( 'enqueue_block_editor_assets', 'ascf_enqueue_backend_assets' );

        // Register Custom Forms blocks category
        add_filter( 'block_categories', 'ascf_register_blocks_category', 10, 2 );

        // Whitelist blocks
        add_filter( 'allowed_block_types', 'ascf_allowed_blocks', 10, 2 );

    }


}


