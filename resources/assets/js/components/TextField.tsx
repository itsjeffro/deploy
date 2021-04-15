import * as React from 'react';
import PropTypes from 'prop-types';

const TextField = (props: any): JSX.Element => {
  const {
    id,
    label,
    onChange,
    name,
    type,
    value,
    placeholder,
    isRequired
  } = props;

  return (
    <div className="form-group">
      { label
        ? <label htmlFor={ id }>{ label } { isRequired ? <span className="text-danger">*</span> : ''}</label>
        : '' }

      <input 
        className="form-control" 
        name={ name } 
        onChange={ onChange }
        type={ type || 'text' }
        id={ id }
        value={ value }
        placeholder={ placeholder }
      />
    </div>
  )
}

export default TextField;
