import * as React from 'react';

import Panel from '../../../components/Panel';
import PanelHeading from '../../../components/PanelHeading';
import PanelTitle from '../../../components/PanelTitle';

const EnvironmentServersTable = (props) => {
  const {
    onSyncServerClick,
    projectServers,
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
          { (projectServers || []).map((projectServer) => {
            const statusId = status[projectServer.server_id];

            let statusText = '';

            if (statusId === 0) {
              statusText = 'syncing';
            } else if (statusId === 1) {
              statusText = 'synced';
            } else if (statusId === 2) {
              statusText = 'failed';
            }

            return (
              <tr key={ projectServer.server.id }>
                <td>
                  <input
                    type="checkbox"
                    name="is_synced_to"
                    id={'server-' + projectServer.server_id}
                    value={projectServer.server_id}
                    checked={ syncedServers.indexOf(projectServer.server_id) >= 0 }
                    onChange={() => onSyncServerClick(projectServer.server_id)}
                  /> <label htmlFor={'server-' + projectServer.server_id}>{ projectServer.server.name } ({ projectServer.server.ip_address }) { statusText || '' } </label>
                </td>
              </tr>
            )
          }) }
          </tbody>
        </table>
      </div>
    </Panel>
  )
};

export default EnvironmentServersTable;
