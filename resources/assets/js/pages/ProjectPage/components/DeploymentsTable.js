import React from 'react';
import { Link } from 'react-router-dom';

import DeploymentsTableRow from './DeploymentsTableRow';

const DeploymentsTable = props => {
  const {
      deployments,
      onRedeployClick
  } = props;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Started At</th>
          <th>Committer</th>
          <th>Commit</th>
          <th className="text-center">Status</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
         {deployments.map(deployment =>
           <DeploymentsTableRow
             key={deployment.id}
             deployment={deployment}
             onRedeployClick={onRedeployClick}
           />
         )}
      </tbody>
    </table>
  )
}

export default DeploymentsTable;