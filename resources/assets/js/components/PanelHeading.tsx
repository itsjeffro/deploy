import * as React from 'react';

const PanelHeading = (props) => {
  return (
    <div className="panel-heading"> 
      { props.children }
    </div>
  )
}

export default PanelHeading;
