/**
 * Get field name
 * Prefix field name if is an existing custom field
 * 
 * @param {string} name 
 * @param {string} type 
 */
export const getFieldName = ( name, type ) => {

    if ( name ) {

        if ( type == 'existing' ) {
            if ( name.indexOf( 'wpas_' ) == -1 ) {
                return 'wpas_' + name
            } 
        }

        if ( ! type ) {
            return name.replace('wpas_', '')
        }

    }


    return name

}