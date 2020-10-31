import * as React from 'react';

const PanelBody = (props) => {
  return (
    <div className="panel-body"> 
      { props.children }
    </div>
  )
}

export default PanelBody;
