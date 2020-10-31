import * as React from 'react';

import Icon from '../../../components/Icon';

const ProcessStatus = props => {
  const {
    process
  } = props;

  if (process.status === 1) { 
    return (
      <span>
        <Icon iconName="check" /> Finished
      </span>
    );
  }

  if (process.status === 2) {
    return (
      <span>
        <Icon iconName="times" /> Finished With Errors
      </span>
    );
  }

  if (process.status === 3) {
    return (
      <span>
        <Icon iconName="spinner fa-spin" /> Running
      </span>
    );
  }

  if (process.status === 4) {
    return (
      <span>
        <Icon iconName="times" /> Cancelled
      </span>
    );
  }

  return (
    <span>
      <Icon iconName="spinner fa-spin" /> Waiting
    </span>
  );
};

export default ProcessStatus;
