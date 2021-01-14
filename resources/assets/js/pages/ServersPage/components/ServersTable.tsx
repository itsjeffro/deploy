import * as React from 'react';

import ServersTableRow from './ServersTableRow';
import PanelBody from "../../../components/PanelBody";

const ServersTable = props => {
  const {
    isLoading,
    servers,
    onServerConnectionTestClick,
    onServerRemoveClick,
    onServerKeyClick
  } = props;

  if (isLoading) {
    return <PanelBody>Loading...</PanelBody>
  }

  if (servers.length === 0) {
    return <PanelBody>No servers</PanelBody>
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
            <th className="text-center">Projects</th>
            <th>&nbsp;</th>
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

export default ServersTable;
