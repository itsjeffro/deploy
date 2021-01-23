import * as React from 'react';

interface PropsInterface {
  variant: string
  label: any
  value: string
  name: string
  isChecked: boolean
  onChange: Function
}

const Radio = (props: PropsInterface) => {
  const { label, value, name, variant, isChecked, onChange } = props;

  let radioVariant = '';

  if (variant === 'tile') {
    radioVariant = 'form-control-label__tile';
  }

  return (
    <label
      className={ `form-control-label ${ radioVariant }` }
      htmlFor={ value }
    >
      <input
        name={ name }
        type="radio"
        value={ value }
        id={ value }
        checked={ isChecked }
        onChange={ (event) => onChange(event, value) }
      /> { label }
    </label>
  )
}

export default Radio;
