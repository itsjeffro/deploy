import React from 'react';
import { Link } from 'react-router-dom';

import ServersTableRow from './ServersTableRow';

const ServersTable = props => {
  const {
    servers,
    onServerConnectionTestClick,
    onServerRemoveClick,
    onServerKeyClick
  } = props;

  if (servers.length === 0) {
    return (
      <></>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Connect As</th>
            <th>IP Address</th>
            <th>Port</th>
            <th>Project Path</th>
            <th>Connection Status</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {servers.map(server =>
            <ServersTableRow
              key={server.id}
              server={server}
              onServerConnectionTestClick={onServerConnectionTestClick}
              onServerRemoveClick={onServerRemoveClick}
              onServerKeyClick={onServerKeyClick}
            />
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ServersTable;