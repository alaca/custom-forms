<?php defined( 'ABSPATH' ) or die( 'Direct Access is not allowed !' );
/**
 * @package   Awesome Support: Custom Forms
 * @author    Awesome Support <contact@getawesomesupport.com>
 * @license   GPL-2.0+
 * @link      http://getawesomesupport.com
 * @copyright 2015-2018 Awesome Support
 *
 * @wpas-custom-forms   1.0.0
 *
 * Plugin Name:       Awesome Support: Custom Forms
 * Plugin URI:        https://getawesomesupport.com/addons/
 * Description:       Custom Forms
 * Version:           1.0.0
 * Author:            The Awesome Support Team
 * Author URI:        https://getawesomesupport.com
 * Text Domain:       as-custom-forms
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path:       /languages
 */

 
// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Include extension base class
if ( !class_exists( 'WPAS_Extension_Base' ) ) {
	
	$wpas_dir = defined( 'WPAS_ROOT' )  ? WPAS_ROOT : ( defined( 'WPAS_AS_FOLDER' ) ? WPAS_AS_FOLDER : 'awesome-support' );
	$wpas_eb_file = trailingslashit( WP_PLUGIN_DIR . '/' . $wpas_dir ) . 'includes/class-extension-base.php';
	
	if( file_exists( $wpas_eb_file ) ) {
		require_once ( $wpas_eb_file );
	} else {
		add_action( 'admin_notices', function() {
		?>	
		
		<div class="error">
			<p>
				<?php printf( __( 'You need Awesome Support to activate this Awesome Support addon. Please <a href="%s" target="_blank">install Awesome Support</a> before continuing.', 'awesome-support' ), esc_url( 'http://getawesomesupport.com/?utm_source=internal&utm_medium=addon_loader&utm_campaign=Addons' ) ); ?>
			</p>
		</div>
			
		<?php	
			
		});
		
		return;
	}
}


/*----------------------------------------------------------------------------*
 * Instantiate the plugin.
 *----------------------------------------------------------------------------*/


add_action( 'plugins_loaded', array( 'AS_Custom_Forms_Loader', 'get_instance' ) );

/**
 * Instantiate the addon.
 *
 * This method runs a few checks to make sure that the addon
 * can indeed be used in the current context, after what it
 * registers the addon to the core plugin for it to be loaded
 * when the entire core is ready.
 *
 * @since  0.1.0
 * @return void.
 */
class AS_Custom_Forms_Loader extends WPAS_Extension_Base {

	/**
	 * Instance of this loader class.
	 *
	 * @since    0.1.0
	 * @var      object
	 */
	protected static $instance = null;


	public function __construct() {

		$this->setVersionRequired( '5.1.0' );            	   // Set required version of core
		$this->setPhpVersionRequired( '5.6' );                 // Set required version of php
		$this->setSlug( 'wpas-custom-forms' );        		   // Set addon slug
		$this->setUid( 'WCF' );                            	   // Set short unique id
		$this->setTextDomain( 'as-custom-forms' );	           // Set text domain for translation
		$this->setVersion( '1.0.0' );                    	   // Set addon version
		$this->setItemId( 123456789 );                    	   // Set addon item id if integrating with EDD licensing module

		parent::__construct();

	}

	/**
	 * Return an instance of this class.
	 *
	 * @since     3.0.0
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {
		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Activate the plugin.
	 *
	 * The activation method just checks if the main plugin
	 * Awesome Support is installed (active or inactive) on the site.
	 * If not, the addon installation is aborted and an error message is displayed.
	 *
	 * @since  0.1.0
	 * @return void.
	 */
	public static function activate() {
		if ( ! class_exists( 'Awesome_Support' ) ) {
			deactivate_plugins( basename( __FILE__ ) );
			wp_die(
				sprintf( __( 'You need Awesome Support to activate this addon. Please <a href="%s" target="_blank">install Awesome Support</a> before continuing.', 'awesome-support' ), esc_url( 'http://getawesomesupport.com/?utm_source=internal&utm_medium=addon_loader&utm_campaign=Addons' ) )
			);
		}

	}

	/**
	 * Load the addon.
	 *
	 * Include all necessary files and instantiate the addon.
	 *
	 * @since  0.1.0
	 * @return void.
	 */
	public function load() {

		include dirname( $this->get_addon_path() ) . '/includes/helpers.php';
		include dirname( $this->get_addon_path() ) . '/includes/api.php';
		include dirname( $this->get_addon_path() ) . '/includes/custom_forms.php';

		AS_Custom_Forms\CustomForms::get_instance()->run();

	}

}