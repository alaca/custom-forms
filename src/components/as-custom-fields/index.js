/**
 * Awesome Support Custom Forms - Custom Fields Component
 */

 /**
 * External dependencies
 */
import debounce from 'lodash/debounce'
import apiFetch from '@wordpress/api-fetch'

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n
const { PanelBody, SelectControl, Button, Spinner } = wp.components
const { Fragment } = wp.element
const { restUrl, restNonce } = ASCF;

export const AsCustomFieldsControls = ( { attributes, onChange } ) => {

    return (

        <Fragment>

            { ! attributes.isDisabled && (

                <PanelBody title={ __( 'Custom field option' ) } initialOpen={ true }>

                    <SelectControl
                        label={ __( 'Field type' ) }
                        value={ attributes.fieldType }
                        options={ attributes.fieldTypeOptions }
                        onChange={ type => onChangeCustomFieldType( type, attributes.inputType, updated => onChange( updated ) ) }
                    />

                    { attributes.fieldsList.length > 0 && attributes.fieldType == 'existing' && (

                        <Fragment>

                            <SelectControl
                                value={ attributes.nameAttr }
                                label={ __( 'Select field' ) }
                                options={ attributes.fieldsList }
                                onChange={ field => getFieldAttributes( field, attributes.fieldsData, updated => onChange( updated ) ) }
                            />


                            { attributes.fieldsData.length > 0 && (

                                <Fragment>

                                    <Button
                                        label={ __( 'Save custom field' ) }
                                        className="button"
                                        disabled={ attributes.isDeletingCustomField || ! attributes.nameAttr  }
                                        onClick={ () => {
                                            onChange( { isDeletingCustomField: true } )
                                            deleteCustomField( attributes, updated => onChange( updated ) ) 
                                        } }
                                        >

                                        { __( 'Delete custom field' ) }

                                    </Button>

                                    { attributes.isDeletingCustomField && (

                                        <Spinner /> 

                                    ) }

                                </Fragment>

                            ) }

                        </Fragment>


                    ) }

                    { attributes.fieldType == 'new' && (

                        <Fragment>

                            <Button
                                label={ __( 'Save custom field' ) }
                                className="button button-primary"
                                disabled={ attributes.isSavingCustomField || ! attributes.nameAttr  }
                                onClick={ () => {
                                    onChange( { isSavingCustomField: true } )
                                    insertCustomField( attributes, updated => onChange( updated ) )
                                } }
                                >

                                { __( 'Save custom field' ) }

                            </Button>

                            { attributes.isSavingCustomField && (

                                <Spinner /> 

                            ) }

                        </Fragment>

                    ) }

                </PanelBody>

            ) }

        </Fragment>

    )

}


export const updateCustomFieldProperty = ( property, value, attributes, debounce = false ) => {

    // Only update existing custom fields
    if ( attributes.fieldType == 'existing' ) {

        debounce 
            ? _updateCustomFieldPropertyDebounce( property, value, attributes )
            : _updateCustomFieldProperty( property, value, attributes )
    }

}



/**
 * Update custom field
 */
const _updateCustomFieldProperty = ( property, value, attributes ) => {

    // Only update existing custom fields
    if ( attributes.fieldType == 'existing' ) {

        apiFetch( { 
            method: 'POST',
            path: restUrl + '/update-custom-field',
            headers: {
                'X-WP-Nonce': restNonce
            },
            data: {
                name: attributes.nameAttr,
                property: property,
                value: value
            }
        } )
        .catch( response => console.log( response ) );    

    }

}



/**
 * Update custom field with delay
 */
const _updateCustomFieldPropertyDebounce = debounce( _updateCustomFieldProperty, 1000 )

/**
 * Insert custom fields
 * 
 * @param {array} attributes 
 * @param {function} callback 
 */
const insertCustomField = ( attributes, callback )  => {

    apiFetch( { 
        method: 'POST',
        path: restUrl + '/insert-custom-field',
        headers: {
            'X-WP-Nonce': restNonce
        },
        data: {
            field_type: attributes.inputType,
            name: attributes.nameAttr,
            label: attributes.labelAttr,
            required: attributes.requiredAttr,
            title: attributes.labelAttr || attributes.nameAttr,
            placeholder: attributes.placeholderAttr,
            options: attributes.fieldOptions || []
        }
    } )
    .then( ( response ) => {

        let data = []
        let list = [ { label: __( 'Select field' ), value: '' } ]

        for( let i in response ) {

            if ( ! response[ i ].field_type || ! response[ i ].field_type.includes( attributes.inputType ) ) continue

            data.push( response[ i ] )
            list.push( { label: response[ i ].title, value: response[ i ].name } )

        }

        callback( {
            isSavingCustomField: false,
            fieldType: 'existing',
            fieldsList: list, 
            fieldsData: data
        } )

    } )
    .catch( response => {

        console.log( response )

        callback( {
            isSavingCustomField: false
        } )

    } );

}


/**
 * Delete custom fields
 * 
 * @param {array} attributes 
 * @param {function} callback 
 */
const deleteCustomField = ( attributes, callback ) => {

    apiFetch( { 
        method: 'POST',
        path: restUrl + '/delete-custom-field',
        headers: {
            'X-WP-Nonce': restNonce
        },
        data: {
            name: attributes.nameAttr,
        }
    } )
    .then( ( response ) => {

        let data = []
        let list = [ { label: __( 'Select field' ), value: '' } ]

        for( let i in response ) {

            if ( ! response[ i ].field_type || ! response[ i ].field_type.includes( attributes.inputType ) ) continue

            data.push( response.data[ i ] )
            list.push( { label: response[ i ].title, value: response[ i ].name } )

        }

        callback( {
            fieldsList: list, 
            fieldsData: data,
            isDeletingCustomField: false,
            fieldType: 'virtual'
        } )

    } )
    .catch( response => {

        console.log( response ) 

        callback( {
            isDeletingCustomField: false,
            fieldType: 'virtual'
        } )

    } );


}

/**
 * On change field type
 * 
 * @param {string} fieldType 
 * @param {string} inputType 
 * @param {function} callback 
 */
const onChangeCustomFieldType = ( fieldType, inputType, callback ) => {

    switch( fieldType ) {

        case 'new':
        case 'virtual':

            callback( { 
                attributesPanelOpened: true,
                fieldType: fieldType,
                nameAttr: '',
                labelAttr:  __( 'Label' ), 
                placeholderAttr: __( 'Placeholder' ), 
                requiredAttr: false,
            } )


            break

        case 'existing':

            callback( { 
                attributesPanelOpened: false, 
                fieldType: fieldType 
            } )

            // Get custom fields from API
            apiFetch( { 
                path: restUrl + '/get-custom-fields', 
                headers: {
                    'X-WP-Nonce': restNonce
                }
            } ).then( response => {

                let data = []
                let list = [ { label: __( 'Select field' ), value: '' } ]

                for( let i in response ) {

                    if ( ! response[ i ].field_type || ! response[ i ].field_type.includes( inputType ) ) continue

                    data.push( response[ i ] )
                    list.push( { label: response[ i ].title, value: response[ i ].name } )

                }

                callback( { fieldsList: list, fieldsData: data } )

            } )

            break

    }


}


/**
 * Get attributes from field data
 * 
 * @param {string} field 
 * @param {array} data 
 * @param {function} callback 
 */
const getFieldAttributes = ( field, data, callback ) => {

    for ( let i in data ) {

        if ( field == data[i].name ) {

            let options = []

            for( let key in data[i].options  ) {

                options.push( {
                    label: key,
                    value: data[i].options[ key ]
                } )
    
            }

            callback( { 
                attributesPanelOpened: true,
                inputType: ( data[i].field_type == 'date-field' ) ? 'date' : data[i].field_type,
                fieldType: 'existing',
                nameAttr: data[i].name,
                labelAttr:  data[i].label || data[i].title, 
                placeholderAttr: data[i].placeholder || __( 'Placeholder' ), 
                requiredAttr: data[i].required,
                fieldOptions: options
            } )

            break

        }
    }

}