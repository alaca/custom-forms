<?php namespace AS_Custom_Forms;
/** 
 * Plugin Name:       Awesome Support: Custom Forms
 * Plugin URI:        
 * Description:       Custom Forms
 * Version:           1.0.1
 * Author:            Awesome Support
 * Author URI:        http://getawesomesupport.com
 * Text Domain:       as-custom-forms
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path:       /languages
 */
 
defined( 'ABSPATH' ) or die;

define( 'AS_CF_SELF',        __FILE__ );
define( 'AS_CF_DIR',         plugin_dir_path( __FILE__ ) );
define( 'AS_CF_URI',         plugin_dir_url( __FILE__ ) );
define( 'AS_CF_DIST_URL',    trailingslashit( AS_CF_URI ) . 'dist/' );
define( 'AS_CF_INC_DIR',     trailingslashit( AS_CF_DIR ) . 'includes/' );

require AS_CF_INC_DIR . 'helpers.php';
require AS_CF_INC_DIR . 'custom_forms.php';

CustomForms()->run();
