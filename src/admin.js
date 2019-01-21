jQuery(document).ready(function ($) {

    /**
     * Load options for selected assign type
     */
    $('#ascf_assign_select').on( 'change', function(e){

        var option = $(this).val();

        if ( option == 'none' ) {

            $('#ascf_assigned_option').html( '' )

        } else {

            $('#ascf_assigned_option').html( '<br /><img src="' + ASCF.adminUrl + '/images/spinner.gif" />' );

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                dataType: 'html',
                data: {
                    action: 'ascf_ajax',
                    name: 'load_option',
                    post_id: $("#post_ID").val(),
                    option: option,
                    nonce: ASCF.nonce
                },
                success: function (data) {
                    $('#ascf_assigned_option').html( data );
                }
            });

        }

    });
    
        
    // Find user by name or email
    $(document).on( 'focus', '#ascf_user_search', function(){

        $(this).autocomplete({

            source: function (request, response) {
                // Fetch data
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        action: 'ascf_ajax',
                        name: 'find_user',
                        post_id: $("#post_ID").val(),
                        term: request.term,
                        nonce: ASCF.nonce
                    },
                    success: function (data) {
                        $('#ascf_assign_user_btn').attr( 'disabled', true ).removeClass('button-primary');
                        response(data);
                    }
                });
            },
            select: function (e, ui) {
                // Set selection
                $('#ascf_user_search').val(ui.item.label);
                $('#ascf_user_selected').val(ui.item.value);

                $('#ascf_assign_user_btn').attr( 'disabled', false ).addClass('button-primary');

                return false;
            }
        });

    });


    // Assign user 
    $(document).on('click', '#ascf_assign_user_btn', function(e){

        e.preventDefault();

        var user_id = $('#ascf_user_selected').val();

        $('#ascf_user_search, #ascf_user_selected').val('');

        $('#ascf_assigned_users').html( '<br /><img src="' + ASCF.adminUrl + '/images/spinner.gif" />' );

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            dataType: 'html',
            data: {
                action: 'ascf_ajax',
                name: 'assign_user',
                post_id: $("#post_ID").val(),
                user_id: user_id,
                nonce: ASCF.nonce
            },
            success: function (data) {
                $('#ascf_assigned_option').html( data );
            }
        });
        

    });


    // Remove user
    $(document).on('click', '.ascf_remove_user', function(e){

        e.preventDefault();

        $(this).parent('.ascf_list_item').fadeOut();

        var user_id = $(this).data('user_id');

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            dataType: 'html',
            data: {
                action: 'ascf_ajax',
                name: 'remove_user',
                post_id: $("#post_ID").val(),
                user_id: user_id,
                nonce: ASCF.nonce
            },
            success: function (data) {
                $('#ascf_assigned_option').html( data );
            }
        });

    });


});