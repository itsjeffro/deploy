import React from 'react';

import Button from '../../../components/Button';
import Icon from '../../../components/Icon';

import ProcessStatus from './ProcessStatus';

const duration = process => {
  let startDate = new Date(process.started_at);
  let finishDate = new Date(process.finished_at);

  return (finishDate.getTime() - startDate.getTime()) / 1000;
};

const statusColor = process => {
  if (process.status === 1) {
    return 'table-success';
  }

  if (process.status === 2 || process.status === 4) {
    return 'table-danger';
  }

  return '';
};

const ProcessTable = props => {
  const {
    sequence,
    onProcessOutputClick
  } = props;

  return (
    <table className="table">
      <thead>
        <tr>
          <th width="15%">Server</th>
          <th width="20%">Status</th>
          <th>Started At</th>
          <th>Finished At</th>
          <th>Duration</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {sequence.processes.map(process => (
          <tr
            key={process.id}
            className={statusColor(process)}
          >
            <td width="15%">
              {process.server_name}
            </td>
            <td width="20%">
              <ProcessStatus
                process={process}
              />
            </td>
            <td>
              {process.started_at ? process.started_at : 'N/A'}
            </td>
            <td>
              {process.finished_at ? process.finished_at : 'N/A'}
            </td>
            <td>
              {process.finished_at ? duration(process) + ' Seconds' : 'N/A'}
            </td>
            <td className="text-right">
              {process.status !== 4 ? (
                <Button
                  onClick={() => onProcessOutputClick(process)}
                >
                  <Icon iconName="files-o" /> Output
                </Button>
              ) : (
                ''
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
};

export default ProcessTable;