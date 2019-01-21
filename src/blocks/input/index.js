/**
 * External dependencies
 */
import { isEmpty } from 'lodash'

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n
const { registerBlockType } = wp.blocks
const { Fragment } = wp.element
const { PanelBody, ToggleControl, TextControl, FontSizePicker, SelectControl } = wp.components
const {	InspectorControls } = wp.editor.InspectorControls ? wp.editor : wp.blocks

/**
 * Internal dependencies
 */
import AsTextControl from '../../components/as-text-control'
import { AsCustomFieldsControls, updateCustomFieldProperty } from '../../components/as-custom-fields'
import { InputIcon } from '../../icons'
import { fontSizes, fallbackFontSize } from '../../settings' 
import { getFieldName } from '../../helpers' 


/**
 * Register block
 */
registerBlockType( 'awesome-support-custom-forms/input', {
    title: 'Input',
    icon: InputIcon,
    description: __( 'Custom Forms Input' ),
    category: 'as_custom_forms',
    attributes: {
        idAttr: {
            type: 'string',
            source: 'attribute',
            selector: 'input',
            attribute: 'id'
        },
        placeholderAttr: {
            type: 'string',
            source: 'attribute',
            selector: 'input',
            attribute: 'placeholder',
            default: __( 'Placeholder' )
        },
        labelAttr: {
            type: 'string',
            default: __( 'Label' )
        },
        valueAttr: {
            type: 'string',
            source: 'attribute',
            selector: 'input',
            attribute: 'value'
        },
        nameAttr: {
            type: 'string',
            source: 'attribute',
            selector: 'input',
            attribute: 'name'
        },      
        requiredAttr: {
            type: 'boolean',
            default: false
        },
        disabledAttr: {
            type: 'boolean',
            source: 'attribute',
            selector: 'input',
            attribute: 'disabled',
            default: false
        },  
        inputType: {
            type: 'string',
            default: 'text'
        },
        fieldType: {
            type: 'string',
            source: 'attribute',
            selector: 'input',
            attribute: 'data-type',
            default: 'virtual'
        },
        isDisabled:{
            type: 'boolean',
            default: false
        },
        isSavingCustomField: {
            type: 'boolean',
            default: false
        },
        isDeletingCustomField: {
            type: 'boolean',
            default: false
        },
        fieldTypeOptions: {
            type: 'array',
            default: [
                { label: __( 'Virtual' ), value: 'virtual' },
                { label: __( 'New custom field' ), value: 'new' },
                { label: __( 'Existing custom field' ), value: 'existing' }
            ]
            
        },
        inputTypeOptions: {
            type: 'array',
            default: [
                { label: 'Text', value: 'text' },
                { label: 'Hidden', value: 'hidden' },
                { label: 'Date', value: 'date' },
                { label: 'Number', value: 'number' },
                { label: 'Email', value: 'email' },
                { label: 'URL', value: 'url' },
                { label: 'Password', value: 'password' },
            ]
            
        },
        fieldsList: {
            type: 'array',
            default: []
            
        },
        fieldsData: {
            type: 'array',
            default: []
            
        },
        labelFontSize: {
            type: 'string'
        },
        attributesPanelOpened: {
            type: 'string',
            default: true
        }
    },
    edit( { attributes, setAttributes } ) {

        const { 
            idAttr, 
            placeholderAttr, 
            labelAttr, 
            valueAttr, 
            requiredAttr, 
            disabledAttr,
            inputType,
            inputTypeOptions,
            nameAttr, 
            fieldType,
            isDisabled, 
            labelFontSize,
            fieldsList,
            attributesPanelOpened
        } = attributes

        const isHidden = ( inputType === 'hidden' )
        const isOpened = ( fieldType == 'existing' ) ? ( fieldsList.length > 1 && ! isEmpty( nameAttr ) ) : attributesPanelOpened

        // Change input type
        function onChangeInputType( type ) {

            let label = labelAttr
            let addon = __( ' - Hidden' )

            if ( type == 'hidden' ) {
                setAttributes( { inputType: type, hidden: true, labelAttr: label += addon } )
            } else {
                setAttributes( { inputType: type, hidden: false, labelAttr: label.replace( addon, '' ) } )
            }

        }


        return (

            <Fragment>

                <AsTextControl
                    label={ labelAttr }
                    labelSize={ labelFontSize }
                    name={ getFieldName( nameAttr, fieldType ) }
                    value={ valueAttr }
                    type={ inputType }
                    id={ idAttr }
                    placeholder={ placeholderAttr }
                    required={ requiredAttr }
                    disabled={ disabledAttr }
                    fieldType={ fieldType }
                    onChange={ value => { setAttributes( { valueAttr: value } ) } }   
                />
                
                <InspectorControls>

                    { ! isDisabled && (

                        <AsCustomFieldsControls 
                            label={ __( 'Custom field option' ) }
                            attributes={ attributes }
                            onChange={ updated => setAttributes( updated ) }
                        />

                    ) }

                    <PanelBody title={ __( 'Attributes' ) } opened={ isOpened }>

                        { ! isHidden && (

                            <Fragment>

                                <TextControl 
                                    label={ __( 'Label' ) } 
                                    value={ labelAttr } 
                                    onChange={ value => {
                                        setAttributes( { labelAttr: value } ) 
                                        updateCustomFieldProperty( 'title', value, attributes, true )
                                    } } 
                                />

                                <FontSizePicker 
                                    fontSizes={ fontSizes } 
                                    value={ labelFontSize }
                                    fallbackFontSize={ fallbackFontSize }
                                    onChange={ value => { setAttributes( { labelFontSize: value } ) } } 
                                />

                                <hr />

                            </Fragment>

                        ) }

                        
                        <SelectControl
                            label={ __( 'Type' ) }
                            value={ inputType }
                            options={ inputTypeOptions }
                            onChange={ value => {
                                onChangeInputType( value )
                                updateCustomFieldProperty( 'field_type', value, attributes )
                            } }
                        />

                        
                        <TextControl 
                            label={ __( 'Name' ) } 
                            value={ getFieldName( nameAttr ) } 
                            onChange={ value => setAttributes( { nameAttr: value } ) } 
                            disabled={  isDisabled || ( fieldType == 'existing' ) }
                        />

                        { ! isHidden && (

                            <Fragment>

                                <TextControl 
                                    label={ __( 'Placeholder' ) } 
                                    value={ placeholderAttr } 
                                    onChange={ value => {
                                        setAttributes( { placeholderAttr: value } ) 
                                        updateCustomFieldProperty( 'placeholder', value, attributes, true )
                                    } } 
                                />

                                <ToggleControl
                                    label={ __( 'Required' ) }
                                    checked={ requiredAttr }
                                    onChange={ value => {
                                        setAttributes( { requiredAttr: value  } ) 
                                        updateCustomFieldProperty( 'required', value, attributes )
                                    } }  
                                />
                                
                                <ToggleControl
                                    label={ __( 'Disabled' ) }
                                    checked={ disabledAttr }
                                    onChange={ value => { setAttributes( { disabledAttr: value } ) } } 
                                />

                            </Fragment>

                        ) }


                        <TextControl 
                            label={ __( 'Value' ) } 
                            value={ valueAttr } 
                            onChange={ value => setAttributes( { valueAttr: value } ) }   
                        />


                    </PanelBody>

                </InspectorControls>

            </Fragment>
        );
    },

    save( { attributes } ) {

        const { 
            idAttr, 
            placeholderAttr, 
            labelAttr, 
            labelFontSize,
            valueAttr, 
            requiredAttr, 
            disabledAttr,
            nameAttr,
            fieldType,
            inputType
        } = attributes

        return (
            
            <AsTextControl
                label={ labelAttr }
                labelSize={ labelFontSize }
                name={ getFieldName( nameAttr, fieldType ) }
                value={ valueAttr }
                id={ idAttr }
                type={ inputType }
                placeholder={ placeholderAttr }
                required={ requiredAttr }
                disabled={ disabledAttr }
                fieldType={ fieldType }
            />
        
        )
        
    }
    
} );

