import React from 'react';

const Grid = props => {
  const {
    xs,
    sm,
    md,
    lg
  } = props;
  
  let styles = Object.assign({},
    (xs ? {'xs-' + xs} : {}),
    (sm ? {'sm-' + sm} : {}),
    (md ? {'md-' + md} : {}),
    (lg ? {'lg-' + lg} : {}),
  );
    
  return (
    <div className={styles}>
      {props.children}
    </div>
  )
}

export default Grid;