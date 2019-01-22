/**
 * Awesome Support Custom Forms - Text control component
 */

 /**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { withInstanceId } =  wp.compose;

const AsTextControl = ( { label, labelSize, name, value, id, instanceId, placeholder, required, classAttr, fieldType, onChange, onClick, type = 'text' } ) => {

	const onChangeValue = ( event ) => onChange( event.target.value )
	const onClickAction = ( event ) => onClick( event.target )

	const elementId =  id || 'as-text-control-' + instanceId

	return (

        <div className={ classnames( 'as-component__input', ( type == 'hidden' ) && 'ascf-hidden' ) }>

			{ label && <label style={ labelSize && { 'font-size': labelSize + 'px' } } className="as-component__label" htmlFor={ elementId }>{ label } { required && ( type != 'hidden' ) && <span className="as-component__required">*</span> }</label> }

            <input
				type={ type }
				id={ elementId }
				name={ name }
				value={ value }
				required={ required }
				placeholder={ placeholder }
                onChange={ onChangeValue }
                onClick={ onClickAction }
				className={ classAttr }
				data-type={ fieldType }
			/>

        </div>

	);
}

export default withInstanceId( AsTextControl );

