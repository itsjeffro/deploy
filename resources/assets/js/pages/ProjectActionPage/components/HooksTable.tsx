import * as React from 'react';

import Button from '../../../components/Button';

const HooksTable = props => {
  const {
    hooks,
    onHandleEditClick,
    onHandleRemoveClick
  } = props;

  if (hooks.length === 0) {
    return (
      <div className="panel-body text-center">
        No hooks added yet
      </div>
    )
  }

  return (
    <div className="table-responsive hooks-table">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {hooks.map((hook) =>
            <tr key={hook.id}>
              <td>
                { hook.name }
              </td>
              <td className="text-right">
                <Button onClick={() => onHandleEditClick(hook)}>Edit</Button>{' '}
                <Button onClick={() => onHandleRemoveClick(hook)}>Remove</Button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
};

export default HooksTable;
