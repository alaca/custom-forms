/**
 * Awesome Support Custom Forms - Textarea control component
 */

/**
 * WordPress dependencies
 */
const { withInstanceId } =  wp.compose;

const AsTextareaControl = ( { label, labelSize, name, value, id, instanceId, placeholder, rows, required, disabled, fieldType, onChange } ) => {

	const onChangeValue = ( event ) => onChange( event.target.value )

	const elementId =  id || 'as-textarea-control-' + instanceId

	return (

        <div className="as-component__input">

			{ label && <label style={ labelSize && { 'font-size': labelSize + 'px' } } className="as-component__label" htmlFor={ elementId }>{ label } { required && <span className="as-component__required">*</span> }</label> }

            <textarea
				id={ elementId }
				name={ name }
				value={ value }
				required={ required }
				disabled={ disabled }
				placeholder={ placeholder }
				rows={ rows }
                onChange={ onChangeValue }
				data-type={ fieldType }
			/>

        </div>

	);
}

export default withInstanceId( AsTextareaControl );