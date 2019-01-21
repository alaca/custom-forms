/**
 * Awesome Support Custom Forms - Toggle control component
 */

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
const { withInstanceId } =  wp.compose;
const { __ } = wp.i18n

const AsToggleControl = ( { label, type, fieldType, labelSize, name, required, stack, instanceId, onChange, options = [] } ) => {

	const id = `as-${ type }-control-${ instanceId }`
	const unique = Math.floor( new Date().valueOf() * Math.random() )

	if ( options.length > 1 && type === 'checkbox' && ! isEmpty( name ) && ! name.includes('[]') ) {
		name += '[]'
	}

	const onSelectOption = ( options, index ) => {

		let updatedOptions = options.map( ( option, i ) => {


			switch( type ) {

				case 'checkbox':

					if ( i === index ) {
						option.checked = !option.checked
					}

					break

				default:

					option.checked = ( i === index ) ? true : false

			}

			return option

		} )

		onChange( updatedOptions )

	}

	return (

		<div className="as-component__input">

			{ ! isEmpty( options ) && (
				
				<div>

					{ label && <label style={ labelSize && { 'font-size': labelSize + 'px' } } className="as-component__label">{ label } { required && <span className="as-component__required">*</span> }</label> }
					
					{ options.map( ( option, index ) =>

						<div className={ ( stack ? 'as_stack_options' : 'as_inline_options' ) }>

							<input
								type={ type }
								id={ option.id || `${ id }-${ index }-${ unique }` }
								name={ name }
								value={ option.value }
								checked={ option.checked === true }
								required={ option.required === true }
								disabled={ option.disabled === true }
								data-label={ option.label }
								data-type={ fieldType }
								className="as-component__toggle"
								onChange={ () => { onSelectOption( options, index ) } }
							/>

							<label htmlFor={ option.id ||  `${ id }-${ index }-${ unique }` }>
								{ option.label }
							</label>

						</div>

					) }

				</div>

			) }


		</div>

	);
}


export default withInstanceId( AsToggleControl );