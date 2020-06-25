import React from 'react';
import { Link } from 'react-router-dom';

const NotificationsTable = (props) => {
  const { 
    items,
    onShowModalClick,
    onMarkAsReadClick,
  } = props;

  const reasons = {
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
            <th>Reason</th>
            <th>Date</th>
            <th width="15%"></th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            return (
              <tr key={ item.id }>
                <td>
                  <span className="small">{ item.model_type } #{ item.model_id }</span><br />
                  <a href="#" onClick={ e => onShowModalClick(item)}>{ item.subject }</a>
                </td>
                <td>
                  <Link to={ '/projects/' + item.project.id }>{ item.project.name }</Link>
                </td>
                <td>
                  <span className={`label label-${reasons[item.reason]}`}>
                    { item.reason }
                  </span>
                </td>
                <td>
                  { item.created_at }
                </td>
                <td className="text-right" width="15%">
                  <button 
                    className="btn btn-default"
                    onClick={ e => onMarkAsReadClick(item.id) }
                  >Mark as read</button>
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
