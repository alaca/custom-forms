/**
 * WordPress dependencies
 */
const { __ } = wp.i18n
const { registerBlockType } = wp.blocks
const { Fragment } = wp.element
const { PanelBody, TextControl, FontSizePicker, ToggleControl } = wp.components
const {	InspectorControls } = wp.editor.InspectorControls ? wp.editor : wp.blocks

/**
 * Internal dependencies
 */
import AsToggleControl from '../../components/as-toggle-control'
import AsToggleInspector from '../../components/as-toggle-inspector'
import { AsCustomFieldsControls, updateCustomFieldProperty } from '../../components/as-custom-fields'
import { CheckboxIcon } from '../../icons'
import { fontSizes, fallbackFontSize } from '../../settings' 
import { getFieldName } from '../../helpers' 

/**
 * Register block
 */
registerBlockType( 'awesome-support-custom-forms/checkbox', {
    title: 'Checkbox',
    icon: CheckboxIcon,
    description: __( 'Custom Forms Checkbox' ),
    category: 'as_custom_forms',
    attributes: {
        nameAttr: {
            type: 'string',
            source: 'attribute',
            selector: '.as-component__toggle',
            attribute: 'name'
        }, 
        labelAttr: {
            type: 'string',
            default: __( 'Label' )
        },  
        checkedAttr: {
            type: 'boolean',
            source: 'attribute',
            selector: '.as-component__toggle',
            attribute: 'checked',
            default: false
        },      
        inputType: {
            type: 'string',
            default: 'checkbox'
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
        fieldTypeOptions: {
            type: 'array',
            default: [
                { label: __( 'Virtual' ), value: 'virtual' },
                { label: __( 'New custom field' ), value: 'new' },
                { label: __( 'Existing custom field' ), value: 'existing' }
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
        requiredAttr: {
            type: 'boolean',
            default: false
        },
        stackAttr: {
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
        attributesPanelOpened: {
            type: 'string',
            default: true
        },
        fieldOptions: {
            type: 'array',
            source: 'query',
            selector: '.as-component__toggle',
            query: {
                id: { source: 'attribute', attribute: 'id' },
                label: { source: 'attribute', attribute: 'data-label' },
                value: { source: 'attribute', attribute: 'value' },
                checked: { source: 'attribute', attribute: 'checked', type: 'boolean' },
                required: { source: 'attribute', attribute: 'required', type: 'boolean' },
                disabled: { source: 'attribute', attribute: 'disabled', type: 'boolean' }
            },
            default: [] 
        }
    },
    edit( { attributes, setAttributes } ) {

        const { 
            labelAttr,
            nameAttr,
            inputType,
            fieldType,
            isDisabled, 
            labelFontSize,
            attributesPanelOpened,
            requiredAttr,
            stackAttr,
            fieldOptions
        } = attributes

        return (

            <Fragment>

                <AsToggleControl
                    type={ inputType }
                    label={ labelAttr }
                    labelSize={ labelFontSize }
                    fieldType={ fieldType }
                    name={ getFieldName( nameAttr, fieldType ) }
                    stack={ stackAttr }
                    required={ requiredAttr }
                    options={ fieldOptions }
                    onChange={ options => {
                        setAttributes( { fieldOptions: options } )
                        updateCustomFieldProperty( 'options', options, attributes )
                    } }
                />
            
                <InspectorControls>

                    <AsCustomFieldsControls 
                        label={ __( 'Custom field option' ) }
                        attributes={ attributes }
                        onChange={ updated => setAttributes( updated ) }
                    />

                    <PanelBody title={ __( 'Attributes' ) } opened={ attributesPanelOpened }>

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
                            onChange={ value => setAttributes( { labelFontSize: value } ) } 
                        />

                        <hr />

                        <TextControl 
                            label={ __( 'Name' ) } 
                            value={ getFieldName( nameAttr ) } 
                            onChange={ value => setAttributes( { nameAttr: value } ) } 
                            disabled={  isDisabled || ( fieldType == 'existing' ) }
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
                            label={ __( 'Stack options' ) }
                            checked={ stackAttr }
                            onChange={ value => setAttributes( { stackAttr: value } ) }  
                        />

                    </PanelBody>

                    <AsToggleInspector 
                        opened={ attributesPanelOpened }
                        type={ inputType }
                        options={ fieldOptions }
                        onChange={ options => {
                            setAttributes( { fieldOptions: options } )
                            updateCustomFieldProperty( 'options', options, attributes, true )
                        } }
                    />

                </InspectorControls>

            </Fragment>
        );
    },

    save( { attributes } ) {

        const { 
            labelAttr, 
            nameAttr,
            labelFontSize,
            fieldType, 
            fieldOptions,
            inputType,
            requiredAttr,
            stackAttr
        } = attributes

        return (
            
            <AsToggleControl
                type={ inputType }
                label={ labelAttr }
                labelSize={ labelFontSize }
                fieldType={ fieldType }
                name={ getFieldName( nameAttr, fieldType ) }
                stack={ stackAttr }
                required={ requiredAttr }
                options={ fieldOptions }
            />
        )
        
    }

} );
