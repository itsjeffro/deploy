import React from 'react';

import Button from '../../../components/Button';
import Icon from '../../../components/Icon';

const FoldersTable = props => {
  const {
    folders,
    modalLinkedFolderRemoveShow
  } = props;

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
        <tr>
          <th>From</th>
          <th>To</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {folders.map(folder =>
          <tr key={folder.id}>
            <td>{folder.from}</td>
            <td>{folder.to}</td>
            <td className="text-right">
              <Button
                color="default"
                onClick={() => modalLinkedFolderRemoveShow(folder)}
              ><Icon iconName="times"/></Button>
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  )
}

export default FoldersTable;