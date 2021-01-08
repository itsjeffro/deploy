import React from 'react';

const PanelTitle = (props) => {
  return (
    <h5 className="panel-title"> 
      { props.children }
    </h5>
  )
}

export default PanelTitle;
