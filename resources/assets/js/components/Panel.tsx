import * as React from 'react';

const Panel = (props) => {
  return (
    <div className="panel panel-default"> 
      { props.children }
    </div>
  )
}

export default Panel;
