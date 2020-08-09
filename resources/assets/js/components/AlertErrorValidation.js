import React from 'react';
import PropTypes from 'prop-types';

import Alert from './Alert';

const AlertErrorValidation = props => {
  const {
    errors
  } = props;
  
  return (
    <Alert type="danger">
      <p>The following errors occurred:</p>
      <ul>
        {errors.map((error, index) => 
          <li key={ index }>
            {error}
          </li>
        )}
      </ul>
    </Alert>
  )
};

AlertErrorValidation.propTypes = {
  errors: PropTypes.array.isRequired
};

export default AlertErrorValidation;