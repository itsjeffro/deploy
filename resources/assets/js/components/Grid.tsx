import * as React from 'react';

const Grid = (props) => {
  const {
    xs,
    sm,
    md,
    lg
  } = props;
  
  let styles = [
    (xs ? 'col-xs-' + xs : ''),
    (sm ? 'col-sm-' + sm : ''),
    (md ? 'col-md-' + md : ''),
    (lg ? 'col-lg-' + lg : ''),
  ];
    
  return (
    <div className={styles.join(' ').trim()}>
      {props.children}
    </div>
  )
};

export default Grid;
