import * as React from 'react';

const Container = (props) => {
  const { fluid } = props;

  return (
    <div className={ fluid ? 'container-fluid' : 'container' }>
      { props.children }
    </div>
  )
}

export default Container;