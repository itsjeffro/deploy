import * as React from 'react';

import ServerModelInterface from '../../../interfaces/model/ServerModelInterface';
import ServersTableRow from './ServersTableRow';

const ServersTable = (props: PropsInterface) => {
  const {
    servers,
    onServerConnectionTestClick,
    onServerRemoveClick,
    onServerKeyClick
  } = props;

  if (servers.length === 0) {
    return (
      <div className="panel-body text-center">
        No servers added yet
      </div>
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {servers.map((server) =>
            <ServersTableRow
              key={ server.id }
              server={ server }
              onServerConnectionTestClick={ onServerConnectionTestClick }
              onServerRemoveClick={ onServerRemoveClick }
              onServerKeyClick={ onServerKeyClick }
            />
          )}
        </tbody>
      </table>
    </div>
  )
}

interface PropsInterface {
  servers: ServerModelInterface[]
  onServerConnectionTestClick: any
  onServerRemoveClick: any
  onServerKeyClick: any
}

export default ServersTable;
