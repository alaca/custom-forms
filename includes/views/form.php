<?php defined( 'ABSPATH' ) or exit ?>

<form class="wpas-form" role="form" method="post" action="<?php echo get_permalink( get_the_ID() ); ?>" id="wpas-new-ticket" enctype="multipart/form-data">

    <?php

        echo apply_filters( 'the_content', $content );

    	wp_nonce_field( 'new_ticket', 'wpas_nonce', true, true );
		wpas_make_button( __( 'Submit ticket', 'awesome-support' ), [ 'name' => 'wpas-submit' ] );
        
        wpas_do_field( 'submit_new_ticket' );

    ?>
        
</form> 