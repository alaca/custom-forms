<?php 

/**
 * Custom Forms class wrapper
 *
 * @return object CustomForms
 * @since 1.0.0
 */
function CustomForms() {
    return AS_Custom_Forms\CustomForms::get_instance();
}

/**
 * Regsiter Custom Forms post type
 *
 * @return void
 * @since 1.0.0
 */
function ascf_register_post_type() {

    // Register post type
    register_post_type( 'as_custom_forms', [
        'labels' => [
            'name'          => __( 'Custom Forms', 'as-custom-forms' ),
            'singular_name' => __( 'Custom Form', 'as-custom-forms' )
        ],
        'supports' => [
            'title',
            'editor'
        ],
        'template' => ascf_get_gutenberg_post_type_template(),
        //'template_lock' => 'insert',
        'show_in_rest' => true,
        'show_ui'      => true,
        'public'       => false,
        'has_archive'  => false,
        'hierarchical' => false
    ] );

}

/**
 * Enqueue frontend block assets
 *
 * @return void
 * @since 1.0.0
 */
function ascf_enqueue_frontend_assets() {
    
    // Styles
    wp_enqueue_style(
        'ascf-css',
        AS_CF_DIST_URL . 'style.build.css', // Built with Webpack
        [ 'wp-blocks' ] // Dependencies
    );
            
}


/**
 * Enqueue backend block assets
 *
 * @return void
 * @since 1.0.0
 */
function ascf_enqueue_backend_assets() {
    
    // Styles.
    wp_enqueue_style(
        'ascf-editor-css', 
        AS_CF_DIST_URL . 'editor.build.css', // Built with Webpack
        [ 'wp-edit-blocks' ] // Dependencies 
    );
    
    // Scripts
    wp_enqueue_script(
        'ascf-editor-js',
        AS_CF_DIST_URL. 'blocks.build.js', // Built with Webpack
        [ 'wp-blocks', 'wp-i18n', 'wp-element' ] // Dependencies
    );
            
}

/**
 * Register Custom Forms blocks category
 *
 * @param array $categories
 * @param WP_Post $post 
 * @return array
 * @since 1.0.0
 */
function ascf_register_blocks_category( $categories, $post ) {

    if ( $post->post_type === 'as_custom_forms' ) {

        return array_merge( $categories, [
            [
                'slug'  => 'as_custom_forms',
                'title' => __( 'Custom Forms Blocks', 'as-custom-forms' ),
            ]
        ] );

    }

    return $categories;

}

/**
 * List of allowed blocks for as_custom_forms post type
 *
 * @param array $categories
 * @param WP_Post $post 
 * @return array
 * @since 1.0.0
 */
function ascf_allowed_blocks( $allowed_block_types, $post ) {

	if ( $post->post_type === 'as_custom_forms' ) {

        $defaults = [ 
            'awesome-support-custom-forms/input',
            'awesome-support-custom-forms/textarea',
            'core/image',
            'core/columns',
            'core/paragraph',
            'core/heading',
        ];

        /**
         * Filter default allowed blocks for as_custom_forms post type
         * @since 1.0.0
         */
        return apply_filters( 'as-custom-forms-allowed-blocks', $defaults );
        
	}
    
    return $allowed_block_types;
    
}

/**
 * Get Gutenberg blocks template used by as_custom_forms post type
 *
 * @return array
 * @since 1.0.0
 */
function ascf_get_gutenberg_post_type_template() {

    $blocks = [
        [
            'core/heading', [
                'content' => __( 'Create a new ticket', 'as-custom-forms' ),
                'level' => 2
            ]
        ],
        [
            'awesome-support-custom-forms/input', [
                'inputType'     => 'text',
                'labelAttr'         => __( 'Ticket Subject', 'as-custom-forms' ),
                'placeholderAttr'   => __( 'Enter subject', 'as-custom-forms' ),
                'requiredAttr'      => true,
                'nameAttr'          => 'title',
                'isAsCoreField' => true,
                'selectOptions' => [
                    [
                        'label' => __( 'Text', 'as-custom-forms' ),
                        'value' => 'text'
                    ],
                    [
                        'label' => __( 'Hidden', 'as-custom-forms' ),
                        'value' => 'hidden'
                    ]
                ]
            ]
        ],
        [
            'awesome-support-custom-forms/textarea', [
                'labelAttr'         => __( 'Ticket content', 'as-custom-forms' ),
                'placeholderAttr'   => __( 'Enter content', 'as-custom-forms' ),
                'requiredAttr'      => true,
                'nameAttr'          => 'post_content',
                'isAsCoreField' => true
            ]
        ]
    ];

    /**
     * Filter blocks template
     * @since 1.0.0
     */
    return apply_filters( 'as-custom-forms-blocks-template', $blocks );

}

/**
 * Filter API custom fields list
 *
 * @param array $fields
 * @return array
 * @since 1.0.0
 */
function ascf_api_custom_fields_filter( $fields ) {

    // List of custom fields to remove from API response
    return array_merge( $fields, [ 
        'ticket-tag', 
        'ticket_channel', 
        'ttl_replies_by_customer', 
        'ttl_replies', 
        'time_notes' 
     ] );
    
}

/**
 * Register dynamic Gutenberg blocks
 *
 * @return void
 * @since 1.0.0
 */
function ascf_register_dynamic_blocks() {

    // Get custom fields data from API
    $request = new WP_REST_Request( 'GET', '/wpas-api/v1/custom-fields-data' );
    $response = rest_do_request( $request );

    if ( $response->is_error() ) {
        return false;
    }

    foreach( $response->get_data() as $field_name => $data ) {

        $type        = $data[ 'args' ][ 'field_type' ];
        $name        = $data[ 'args' ][ 'name' ];
        $label       = empty( $data[ 'args' ][ 'label' ] ) ? $data[ 'args' ][ 'title' ] : $data[ 'args' ][ 'label' ];
        $required    = empty( $data[ 'args' ][ 'field_type' ] ) ? false : true;
        $placeholder = $data[ 'args' ][ 'placeholder' ];

        register_block_type( 'awesome-support-custom-forms/' . $type, [
            'attributes' => [
                'nameAttr' => [
                    'type'      => 'string',
                    'source'    => 'attribute',
                    'selector'  => 'textarea',
                    'attribute' => 'name'
                ],
                'label'       => $label,
                'required'    => $required,
                'placeholder' => $placeholder
            ]

        ] );

    }


}