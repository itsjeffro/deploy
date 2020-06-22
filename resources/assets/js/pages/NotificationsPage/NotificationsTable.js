import React from 'react';
import { Link } from 'react-router-dom';

const NotificationsTable = (props) => {
  const { items } = props;

  const types = {
    'info': 'info',
    'error': 'danger',
  };

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Project</th>
            <th>Type</th>
            <th>Date</th>
            <th width="15%"></th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const projectId = item.project ? item.project.id : null;
            const projectName = item.project ? item.project.name : '--';

            return (
              <tr key={ item.id }>
                <td>
                  <strong>
                    <Link to={ '/notifications/' + item.id }>{ item.subject }</Link>
                  </strong>
                </td>
                <td>
                    <Link to={ '/projects/' + projectId }>{ projectName }</Link>
                </td>
                <td>
                  <span className={`label label-${types[item.type]}`}>
                    { item.type }
                  </span>
                </td>
                <td>
                  { item.created_at }
                </td>
                <td className="text-right" width="15%">
                  <Link className="btn btn-default" to="">Mark as read</Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
};

export default NotificationsTable;
