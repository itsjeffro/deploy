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
    placeholder
  } = props;

  return (
    <div className="form-group">
      { label ? <label htmlFor={ id }>{ label }</label> : '' }

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

TextField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.any,
};

export default TextField;
