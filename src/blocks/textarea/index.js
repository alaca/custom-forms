/**
 * WordPress dependencies
 */
const { __ } = wp.i18n
const { registerBlockType } = wp.blocks
const { Fragment } = wp.element
const { PanelBody, ToggleControl, TextControl, FontSizePicker  } = wp.components
const {	InspectorControls } = wp.editor.InspectorControls ? wp.editor : wp.blocks

/**
 * Internal dependencies
 */

import AsTextareaControl from '../../components/as-textarea-control'
import { TextareaIcon } from '../../icons'
import { fontSizes, fallbackFontSize } from '../../settings' 

import apiFetch from '@wordpress/api-fetch';

/**
 * Register block
 */
registerBlockType( 'awesome-support-custom-forms/textarea', {
    title: 'Textarea',
    icon: TextareaIcon,
    description: __( 'Custom Forms Textarea', 'as-custom-forms' ),
    category: 'as_custom_forms',
    attributes: {
        idAttr: {
            type: 'string',
            source: 'attribute',
            selector: 'textarea',
            attribute: 'id'
        },
        classAttr: {
            type: 'string',
            source: 'attribute',
            selector: 'textarea',
            attribute: 'class'
        },
        placeholderAttr: {
            type: 'string',
            source: 'attribute',
            selector: 'textarea',
            attribute: 'placeholder',
            default: __( 'Placeholder', 'as-custom-forms' )
        },
        rowsAttr: {
            type: 'number',
            source: 'attribute',
            selector: 'textarea',
            attribute: 'rows',
            default: 5,
        },
        labelAttr: {
            type: 'string',
            default: __( 'Label', 'as-custom-forms' )
        },
        valueAttr: {
            type: 'string',
            source: 'text',
            selector : 'textarea'
        },
        nameAttr: {
            type: 'string',
            source: 'attribute',
            selector: 'textarea',
            attribute: 'name'
        },      
        requiredAttr: {
            type: 'boolean',
            default: false
        },
        isDisabled:{
            type: 'boolean',
            default: false
        },
        labelFontSize: {
            type: 'string'
        }
    },
    edit( { attributes, setAttributes } ) {

        const { 
            idAttr, 
            classAttr, 
            placeholderAttr, 
            rowsAttr, 
            labelAttr, 
            valueAttr, 
            requiredAttr, 
            nameAttr, 
            isDisabled, 
            labelFontSize 
        } = attributes

        function onRowsChange( value ) {
            setAttributes( { rowsAttr: ( value >= 1 && value <= 12 ) ? value : 5 } )
        }
        
        return (

            <Fragment>

                <AsTextareaControl
                    label={ labelAttr }
                    labelSize={ labelFontSize }
                    name={ nameAttr }
                    value={ valueAttr }
                    id={ idAttr }
                    placeholder={ placeholderAttr }
                    rows={ rowsAttr }
                    required={ requiredAttr }
                    classAttr={ classAttr } 
                    onChange={ value => { setAttributes( { valueAttr: value } ) } }   
                    onClick={ attr => { setAttributes( { idAttr: attr.id, rowsAttr: attr.rows } ) } } 
                />
                
                <InspectorControls>

                    <PanelBody title={ __( 'Attributes', 'as-custom-forms' ) } initialOpen={ true }>

                        <TextControl 
                            label={ __( 'Label', 'as-custom-forms' ) } 
                            value={ labelAttr } 
                            onChange={ value => { setAttributes( { labelAttr: value } ) } } 
                        />

                        <FontSizePicker 
                            fontSizes={ fontSizes } 
                            value={ labelFontSize }
                            fallbackFontSize={ fallbackFontSize }
                            onChange={ value => { setAttributes( { labelFontSize: value } ) }} 
                        />

                        <hr />

                        <ToggleControl
                            label={ __( 'Required', 'as-custom-forms' ) }
                            checked={ requiredAttr }
                            onChange={ value => { setAttributes( { requiredAttr: value } ) } } 
                        />

                        <TextControl 
                            label={ __( 'Name', 'as-custom-forms' ) } 
                            value={ nameAttr } 
                            onChange={ value => { setAttributes( { nameAttr: value } ) } } 
                            disabled={ isDisabled }
                        />

                        <TextControl 
                            label="ID"
                            value={ idAttr } 
                            onChange={ value => { setAttributes( { idAttr: value } ) } }   
                        />

                        <TextControl 
                            label={ __( 'Class', 'as-custom-forms' ) } 
                            value={ classAttr } 
                            onChange={ value => { setAttributes( { classAttr: value } ) } }   
                        />

                        <TextControl 
                            label={ __( 'Placeholder', 'as-custom-forms' ) } 
                            value={ placeholderAttr } 
                            onChange={ value => { setAttributes( { placeholderAttr: value } ) } } 
                        />
                        
                        <TextControl 
                            label={ __( 'Value', 'as-custom-forms' ) } 
                            value={ valueAttr } 
                            onChange={ value => { setAttributes( { valueAttr: value } ) } }   
                        />

                        <TextControl 
                            type="number"
                            min="1"
                            max="12"
                            label={ __( 'Rows', 'as-custom-forms' ) } 
                            value={ rowsAttr } 
                            onChange={ onRowsChange }   
                        />

                    </PanelBody>

                </InspectorControls>

            </Fragment>
        );
    },

    save( { attributes } ) {

        const { 
            idAttr, 
            classAttr, 
            placeholderAttr, 
            rowsAttr, 
            labelAttr, 
            valueAttr, 
            requiredAttr, 
            nameAttr 
        } = attributes

        return (
            
            <AsTextareaControl
                label={ labelAttr }
                name={ nameAttr }
                value={ valueAttr }
                id={ idAttr }
                placeholder={ placeholderAttr }
                rows={ rowsAttr }
                required={ requiredAttr }
                classAttr={ classAttr } 
            />
        
        )
        
    }
    
} );

