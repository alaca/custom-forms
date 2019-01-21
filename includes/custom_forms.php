<?php namespace AS_Custom_Forms;

/**
 * Awesome Support Custom Forms
 *
 */
class CustomForms
{
    private static $instance = null;

    private function __construct() {

        // Register post type 
        add_action( 'init', 'ascf_register_post_type' );

        // Register shortcode
        add_action( 'init', 'ascf_register_shortcode' );

        // Load custom fields
        add_action( 'init', 'ascf_load_custom_fields' );

        // Register routes
        add_action( 'rest_api_init', [ API::get_instance(), 'registerRoutes' ] );

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

        // Add meta boxes
        add_action('add_meta_boxes', 'ascf_add_meta_boxes' );

        // User options
        add_action( 'show_user_profile', 'ascf_add_user_form_options' );
        add_action( 'edit_user_profile', 'ascf_add_user_form_options' );

    } 


}


