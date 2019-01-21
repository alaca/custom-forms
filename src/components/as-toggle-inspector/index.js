/**
 * Awesome Support Custom Forms - Toggle inspector component
 */

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n
const { Fragment } = wp.element
const { PanelBody, TextControl, Button, ToggleControl } = wp.components


const AsToggleInspector = ( { type, options, opened, onChange } ) => {

    // Set default option
    if ( isEmpty( options ) ) {

        onChange( [
            { 
                id: false,
                label: __( 'Enter label' ), 
                value: __( 'Enter value' ),
                checked: true
            }
        ] )

    }


    function action( action, options, index, value ) {

        let newOptions

        switch( action ) {

            case 'add':

                newOptions = options.concat( {
                    label: __( 'Enter label' ), 
                    value: __( 'Enter value' )
                } )

                break

            case 'remove':

                newOptions = options.filter( ( option, i ) => index !== i )

                break

            case 'move':

                options.splice( parseInt( index + value ), 0, options.splice( index, 1 )[0] )
                newOptions = options.concat()

                break

            case 'label':
            case 'value':
            case 'required':
            case 'disabled':
            case 'checked':
            
                newOptions = options.map( ( option, i ) => {

                    if ( i === index ) {
                        option[ action ] = value
                    }
                    
                    return option
                } )

                break

        }

        /**
         * Return options to parent component
         */
        onChange( newOptions )

    }

    
    return (

        <PanelBody title={ __( 'Options' ) } opened={ opened } >

            { ! isEmpty( options ) && (

                <Fragment>

                    { options.map( ( option, index ) => 

                        <div className="as-toggle-inspector-option">

                            <div className="as-cf-row">

                                <div className="as-cf-column">
                                    
                                    <Button
                                        disabled={ index <= 0 }
                                        className="as-cf-options-move-up-btn"
                                        onClick={ () => action( 'move', options, index, -1 ) }>

                                        <i className="dashicons dashicons-arrow-up-alt2"></i>
                                    </Button>

                                    <Button
                                        disabled={ index >= ( options.length -1 ) }
                                        className="as-cf-options-move-down-btn"
                                        onClick={ () => action( 'move', options, index, 1 ) }>

                                        <i className="dashicons dashicons-arrow-down-alt2"></i>

                                    </Button>

                                </div>

                                <div className="as-cf-column">

                                    <TextControl
                                        type="text" 
                                        label={ __( 'Label' ) } 
                                        value={ option.label } 
                                        onChange={ value => action( 'label', options, index, value ) }   
                                    />

                                </div>
                                
                                <div className="as-cf-column">

                                    <TextControl
                                        type="text" 
                                        label={ __( 'Value' ) } 
                                        value={ option.value } 
                                        onChange={ value => action( 'value', options, index, value ) }    
                                    />
                                
                                </div>

                                <div className="as-cf-column">
                                
                                    { options.length > 1 && (

                                        <Button
                                            className="as-cf-options-remove-btn"
                                            onClick={ () => action( 'remove', options, index ) }>

                                            <i className="dashicons dashicons-no-alt"></i>

                                        </Button>

                                    ) }

                                </div>

                            </div> 

                            { type === 'checkbox' && (

                                <div className="as-cf-row">

                                    <div className="as-cf-column-full">

                                        <ToggleControl
                                            label={ __( 'Required' ) }
                                            checked={ option.required }
                                            onChange={ value => action( 'required', options, index, value )  }  
                                        />

                                    </div>

                                </div>

                            ) }

                            { type === 'checkbox' && (

                                <div className="as-cf-row">

                                    <div className="as-cf-column-full">

                                        <ToggleControl
                                            label={ __( 'Checked' ) }
                                            checked={ option.checked }
                                            onChange={ value => action( 'checked', options, index, value )  }  
                                        />

                                    </div>

                                </div>

                            ) }


                            { type !== 'select' && (

                                <div className="as-cf-row">

                                    <div className="as-cf-column-full">

                                        <ToggleControl
                                            label={ __( 'Disabled' ) }
                                            checked={ option.disabled }
                                            onChange={ value => action( 'disabled', options, index, value )  }  
                                        />

                                    </div>

                                </div>

                            ) }


                        </div>

                    ) }

                    
                </Fragment>

            ) }

            <br />

            <Button
                className="button" 
                onClick={ () => action( 'add', options ) }>

                { __( 'Add option' ) }

            </Button>

        </PanelBody>

    )  

}


export default AsToggleInspector