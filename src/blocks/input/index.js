/**
 * WordPress dependencies
 */
const { __ } = wp.i18n
const { registerBlockType } = wp.blocks
const { Fragment } = wp.element
const { PanelBody, ToggleControl, TextControl, SelectControl, FontSizePicker  } = wp.components
const {	InspectorControls } = wp.editor.InspectorControls ? wp.editor : wp.blocks

import apiFetch from '@wordpress/api-fetch'

/**
 * Internal dependencies
 */
import AsTextControl from '../../components/as-text-control'
import { InputIcon } from '../../icons'
import { fontSizes, fallbackFontSize } from '../../settings'


/**
 * Register block
 */
registerBlockType( 'awesome-support-custom-forms/input', {
    title: 'Input',
    icon: InputIcon,
    description: __( 'Custom Forms Input', 'as-custom-forms' ),
    category: 'as_custom_forms',
    attributes: {
        idAttr: {
            type: 'string',
            source: 'attribute',
            selector : 'input',
            attribute: 'id'
        },
        classAttr: {
            type: 'string',
            source: 'attribute',
            selector: 'input',
            attribute: 'class'
        },
        placeholderAttr: {
            type: 'string',
            source: 'attribute',
            selector: 'input',
            attribute: 'placeholder',
            default: __( 'Placeholder', 'as-custom-forms' )
        },
        labelAttr: {
            type: 'string',
            default: __( 'Label', 'as-custom-forms' )
        },
        valueAttr: {
            type: 'string',
            source: 'attribute',
            selector : 'input',
            attribute: 'value',
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
        inputType: {
            type: 'string'
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
        selectOptions: {
            type: 'array',
            default: [
                { label: 'Text', value: 'text' },
                { label: 'Hidden', value: 'hidden' },
                { label: 'Date', value: 'date' },
                { label: 'Number', value: 'number' },
                { label: 'Email', value: 'email' },
            ]
            
        },
        fieldOptions: {
            type: 'array',
            default: [
                { label: __( 'Virtual', 'as-custom-forms' ), value: 'virtual' },
                { label: __( 'New custom field', 'as-custom-forms' ), value: 'new' },
                { label: __( 'Existing custom field', 'as-custom-forms' ), value: 'existing' }
            ]
            
        },
        labelFontSize: {
            type: 'string'
        }
    },
    edit( { attributes, setAttributes } ) {

        let { 
            idAttr, 
            classAttr, 
            placeholderAttr, 
            labelAttr, 
            valueAttr, 
            requiredAttr, 
            nameAttr, 
            inputType, 
            fieldType, 
            isDisabled, 
            selectOptions, 
            fieldOptions, 
            labelFontSize 
        } = attributes

        // Select custom field type
        function onSelectFieldType( type ) {


            
                    /** 

            switch( type ) {

                case 'new':

                    apiFetch( { path: '/dev/wp-json/wp/v2/posts' } ).then( posts => {
                        console.log( 'new', posts );
                    } );

                    break;

                case 'existing':

                    apiFetch( { path: '/dev/wp-json/wp/v2/posts' } ).then( posts => {
                        console.log( 'existing', posts );
                    } );

     
                    break;
            }

                */


            setAttributes( { fieldType: type } )


        }

        // Change input type
        function onChangeInputType( type ) {

            let addonString = __( ' - Hidden', 'as-custom-forms' )

            if ( type == 'hidden' ) {
                setAttributes( { inputType: type, hidden: true, labelAttr: labelAttr += addonString } )
            } else {
                setAttributes( { inputType: type, hidden: false, labelAttr: labelAttr.replace( addonString, '' ) } )
            }

        }
        
        return (

            <div>

                <AsTextControl
                    label={ labelAttr }
                    labelSize={ labelFontSize }
                    name={ nameAttr }
                    id={ idAttr }
                    value={ valueAttr }
                    placeholder={ placeholderAttr }
                    required={ requiredAttr }
                    type={ inputType }
                    classAttr={ classAttr }  
                    fieldType={ fieldType }
                    onChange={ value => { setAttributes( { valueAttr: value } ) } } 
                    onClick={ attr => { setAttributes( { idAttr: attr.id } ) } } 

                />
                
                <InspectorControls>

                    <PanelBody title={ __( 'Custom field option', 'as-custom-forms' ) } initialOpen={ true }>

                        <SelectControl
                            label={ __( 'Field type', 'as-custom-forms' ) }
                            value={ fieldType }
                            options={ fieldOptions }
                            onChange={ onSelectFieldType }
                        />

                    </PanelBody>

                    <PanelBody title={ __( 'Attributes', 'as-custom-forms' ) } initialOpen={ true }>

                        <Fragment>

                            { ( inputType != 'hidden' ) && (

                                <Fragment>

                                    <TextControl 
                                        label={ __( 'Label', 'as-custom-forms' ) } 
                                        value={ labelAttr } 
                                        onChange={ value => { setAttributes( { labelAttr: value } ) } } 
                                    />

                                    <FontSizePicker 
                                        fontSizes={ fontSizes } 
                                        value={ labelFontSize }
                                        fallbackFontSize={ fallbackFontSize }
                                        onChange={ value => { setAttributes( { labelFontSize: value } ) } } 
                                    />

                                    <hr />

                                    <ToggleControl
                                        label={ __( 'Required', 'as-custom-forms' ) }
                                        checked={ requiredAttr }
                                        onChange={ value => { setAttributes( { requiredAttr: value } ) } } 
                                    />

                                </Fragment>

                            ) }

                            <TextControl 
                                label={ __( 'Name', 'as-custom-forms' ) } 
                                value={ nameAttr } 
                                onChange={ value => { setAttributes( { nameAttr: value } ) } } 
                                disabled={ isDisabled }
                            />

                            { ( inputType != 'hidden' ) && (

                                <Fragment>

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

                                </Fragment>

                            ) }
                            
                            <TextControl 
                                label={ __( 'Value', 'as-custom-forms' ) } 
                                value={ valueAttr } 
                                onChange={ value => { setAttributes( { valueAttr: value } ) } }   
                            />

                            <SelectControl
                                label={ __( 'Type', 'as-custom-forms' ) }
                                value={ inputType }
                                options={ selectOptions }
                                onChange={ onChangeInputType }
                            />

                        </Fragment>

                    </PanelBody>

                </InspectorControls>

            </div>
        );
    },

    save( { attributes } ) {

        const { idAttr, classAttr, placeholderAttr, labelAttr, valueAttr, requiredAttr, nameAttr, inputType, fieldType } = attributes

        return (
            
            <AsTextControl
                label={ labelAttr }
                name={ nameAttr }
                id={ idAttr }
                value={ valueAttr }
                placeholder={ placeholderAttr }
                required={ requiredAttr }
                type={ inputType }
                classAttr={ classAttr }  
                fieldType={ fieldType }
            />
        
        )
        
    }
    
} );

