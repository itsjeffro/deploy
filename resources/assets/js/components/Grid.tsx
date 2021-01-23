import * as React from 'react';

interface PropsInterface {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  children?: any
}

const Grid = (props: PropsInterface) => {
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
    <div className={ styles.join(' ').trim() }>
      { props.children }
    </div>
  )
};

export default Grid;
