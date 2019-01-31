import React from 'react';

import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';

const EnvironmentServersTable = (props) => {
  const {
    project,
    syncedServers,
    syncStatus
  } = props;

  return (
    <Panel>
      <PanelHeading>
        <div className="pull-right">
          {syncStatus}
        </div>
        <PanelTitle>Servers</PanelTitle>
      </PanelHeading>
      <div className="table-responsive">
        <table className="table">
          <thead>
          <tr>
            <th>Server</th>
          </tr>
          </thead>
          <tbody>
          {(project.servers||[]).map(server =>
            <tr key={server.id}>
              <td>
                <input
                  type="checkbox"
                  name="is_synced_to"
                  id={'server-' + server.id}
                  value={server.id}
                  checked={syncedServers.indexOf(server.id) >= 0}
                  onChange={() => console.log(server.id)}
                /> <label htmlFor={'server-' + server.id}>{server.name} ({server.ip_address})</label>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </Panel>
  )
};

export default EnvironmentServersTable;