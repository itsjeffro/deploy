import * as React from 'react';

const Alert = props => {
  const {
    dismissible,
    type,
    message
  } = props;
  
  const classDismissible = dismissible ? ' alert-dismissible' : '';
  const classAlertType = 'alert alert-' + (type ? type : 'info');

  return (
    <div className={classAlertType + classDismissible}>
      {dismissible ? 
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        : ''}

      {message || props.children}
    </div>
  )
};

export default Alert;
