import React from 'react';

import Panel from '../../../components/Panel';
import PanelHeading from '../../../components/PanelHeading';
import PanelTitle from '../../../components/PanelTitle';

const EnvironmentServersTable = (props) => {
  const {
    onSyncServerClick,
    project,
    syncedServers,
    status,
  } = props;

  return (
    <Panel>
      <PanelHeading>
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
          {(project.servers||[]).map(server => {
            const statusId = status[server.id];

            let statusText = '';

            if (statusId === 0) {
              statusText = 'syncing';
            } else if (statusId === 1) {
              statusText = 'synced';
            } else if (statusId === 2) {
              statusText = 'failed';
            }

            return (
              <tr key={server.id}>
                <td>
                  <input
                    type="checkbox"
                    name="is_synced_to"
                    id={'server-' + server.id}
                    value={server.id}
                    checked={syncedServers.indexOf(server.id) >= 0}
                    onChange={() => onSyncServerClick(server.id)}
                  /> <label htmlFor={'server-' + server.id}>{server.name} ({server.ip_address}) { statusText || '' } </label>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
};

export default EnvironmentServersTable;