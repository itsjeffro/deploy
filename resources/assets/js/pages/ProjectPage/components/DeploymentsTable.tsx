import * as React from 'react';

import DeploymentsTableRow from './DeploymentsTableRow';

const DeploymentsTable = props => {
  const {
      deployments,
      onRedeployClick
  } = props;

  if (deployments.length === 0) {
    return (
      <div className="panel-body text-center">
        No deployments made yet
      </div>
    )
  }

  return (
    <div className="table-responsive">
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
    </div>
  )
}

export default DeploymentsTable;