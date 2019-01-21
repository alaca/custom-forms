<?php namespace AS_Custom_Forms;

class API 
{
    private static $instance = null;
	private $namespace;
	private $version;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	private function __construct() {

        $this->version   = 1;
        $this->namespace = sprintf( 'wpas-api/v%d/custom-forms', $this->version );
        
    }

    /**
     * Get API instance
     *
     * @return API
     * @since 1.0.0
     */
    public static function get_instance() {

        if ( is_null( static::$instance ) ) {
            static::$instance = new static();
        }

        return static::$instance;
    }


    /**
     * Get API namespace
     *
     * @return string
     * @since 1.0.0
     */
    public static function get_namespace() {
        return static::get_instance()->namespace;
    }
    
	/**
	 * Register REST API routes
     * 
     * @return void
     * @since 1.0.0
	 */
	public function registerRoutes() {

		// Get custom fields
		register_rest_route(
			$this->namespace,
			'/get-custom-fields',
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'getCustomFields' ],
				'permission_callback' => function () {
					return current_user_can( 'create_ticket' );
				},
            ]
        );
        
        // Add custom fields
		register_rest_route(
			$this->namespace,
			'/update-custom-field',
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'updateCustomField' ],
				'permission_callback' => function () {
					return current_user_can( 'create_ticket' );
				},
            ]
        );
        
        // Insert custom fields
		register_rest_route(
			$this->namespace,
			'/insert-custom-field',
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'insertCustomField' ],
				'permission_callback' => function () {
					return current_user_can( 'create_ticket' );
				},
            ]
        );
        
        // Delete custom fields
		register_rest_route(
			$this->namespace,
			'/delete-custom-field',
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'deleteCustomField' ],
				'permission_callback' => function () {
					return current_user_can( 'create_ticket' );
				},
            ]
		);
    }
    
    /**
     * Get custom fields array
     *
     * @return void
     * @since 1.0.0
     */
    public function getFields() {

        $fields = get_option( 'wpas_custom_fields', [] );

        return ( empty( $fields ) ) ? [] : $fields;

    }

    /**
     * Get custom fields
     *
     * @return void
     * @since 1.0.0
     */
    public function getCustomFields() {

        $response = [];

        $custom_fields = WPAS()->custom_fields->get_custom_fields();

        foreach( $custom_fields as $name => $data ) {

            if ( 
                boolval( $data[ 'args' ][ 'backend_only' ] )  // Backend only custom field
                || boolval( $data[ 'args' ][ 'hide_front_end' ] )  // Hide on front end
                || boolval( $data[ 'args' ][ 'core' ] )  // Core custom field
            ) continue;

            // Append name attribute
            $data[ 'args' ][ 'name' ] = $name;

            $response[] = $data[ 'args' ];

        }

        wp_send_json( $response );

    }


    /**
     * Update custom field
     *
     * @return void
     * @since 1.0.0
     */
    public function updateCustomField() {

        $input  = $this->getInputForUpdate();
        $fields = $this->getFields(); 
        $found  = false;

        foreach( $fields as $i => $field ) {

            if ( $field[ 'name' ] === $input[ 'name' ] ) {
                $fields[ $i ][ $input[ 'property' ] ] = $input[ 'value' ];
                $found = $i;
                break;
            }

        }


        if ( is_int( $found ) ) {

            update_option( 'wpas_custom_fields', $fields );

            wp_send_json_success( [ 
                'status' => sprintf( __( 'Field %s updated', 'as-custom-forms' ),  $fields[ $found ][ 'title' ] ) 
            ] );

        }

        wp_send_json( [
            'status' => sprintf( __( 'Field %s not found', 'as-custom-forms' ),  $input[ 'name' ] ) 
        ] );
        
    }


    /**
     * Insert custom fields
     *
     * @return json
     * @since 1.0.0
     */
    public function insertCustomField() {

        $data = array_merge( $this->getFields(), [ $this->getInputForInsert() ] );

        update_option( 'wpas_custom_fields', $data );

        // Response with all fields
        wp_send_json( $data );

    }


    /**
     * Delete custom fields
     *
     * @return json
     * @since 1.0.0
     */
    public function deleteCustomField() {

        $name   = $this->getInputNameField();
        $fields = $this->getFields();
        $found  = false;

        foreach( $fields as $i => $field ) {

            if ( $field[ 'name' ] == $name ) {
                $found = $i;
                unset( $fields[ $i ] );
                break;
            }

        }

        if ( is_int( $found ) || empty( $fields ) ) {
            update_option( 'wpas_custom_fields', $fields );
        }

        wp_send_json( $fields );

    }

    /**
     * Get input for insert
     *
     * @return array
     * @since 1.0.0
     */
    public function getInputForInsert() {

        $input  = json_decode( file_get_contents('php://input'), true );

        if ( 
            empty( $input ) 
            || ! isset( $input[ 'name' ], $input[ 'field_type' ] ) 
        ) {
            wp_send_json_error( __( 'Request parameters missing', 'as-custom-forms' ) );
        }

        // Prepare input data
        $input[ 'title' ]      = sanitize_text_field( $input[ 'name' ] );
        $input[ 'name' ]       = sanitize_title( $input[ 'name' ] );
        $input[ 'field_type' ] = str_replace( 'date', 'date-field', sanitize_text_field( $input[ 'field_type' ] ) );

        $options = [];

        // Prepare options
        if ( is_array( $input[ 'options' ]  ) ) {

            foreach( $input[ 'options' ] as $option ) {

                if ( array_key_exists( $option[ 'label' ], $options ) ) {
                    $option[ 'label' ]  = $option[ 'label' ] . ' ' . $i;
                }

                $options[ $option[ 'label' ] ] = $option[ 'value' ]; 
            }

        }

        $input[ 'options' ] = $options;


        // Default custom field data
        $defaults = [
            'field_type'  => 'text',
            'label'       => __( 'Label', 'as-custom-forms' ),
            'checked'     => false,
            'disabled'    => false,
            'required'    => false,
            'placeholder' => __( 'Placeholder', 'as-custom-forms' )
        ];

        return wp_parse_args( $input, $defaults );
            
    }

    /**
     * Get input fields for update
     *
     * @return void
     * @since 1.0.0
     */
    public function getInputForUpdate() {

        $input = json_decode( file_get_contents('php://input'), true );

        if ( 
            empty( $input ) 
            || ! isset( $input[ 'name' ], $input[ 'property' ], $input[ 'value' ] ) 
            || $input[ 'property' ] == 'name'
        ) {
            wp_send_json_error( __( 'Request parameters missing', 'as-custom-forms' ) );
        }

        switch( $input[ 'property' ] ) {


            case 'field_type':

                $input[ 'value' ] = str_replace( 'date', 'date-field', sanitize_text_field( $input[ 'value' ] ) );

                break;
                

            case 'required':

                $input[ 'value' ] = ( !!$input[ 'value' ] ) ? 1 : 0;

                break;

            case 'options':

                $options = [];
                
                if ( is_array( $input[ 'value' ]  ) ) {

                    foreach( $input[ 'value' ] as $i => $option ) {

                        if ( isset( $option[ 'label' ], $option[ 'value' ] ) ) {

                            if ( array_key_exists( $option[ 'label' ], $options ) ) {
                                $option[ 'label' ]  = $option[ 'label' ] . ' ' . $i;
                            }

                            $options[ $option[ 'label' ] ] = $option[ 'value' ]; 

                        }
                        
                    }

                }

                $input[ 'value' ] = $options;
                
                break;

            default:

                $input[ 'value' ] = sanitize_text_field( $input[ 'value' ] );

        }


        return $input;

    }

    /**
     * Get input name field
     *
     * @return void
     * @since 1.0.0
     */
    public function getInputNameField() {

        $input = json_decode( file_get_contents('php://input'), true );

        if ( 
            empty( $input ) 
            || ! isset( $input[ 'name' ] ) 
        ) {
            wp_send_json_error( __( 'Request parameters missing', 'as-custom-forms' ) );
        }

        return sanitize_text_field( $input[ 'name' ] );

    }

}