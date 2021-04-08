import * as React from 'react';
import { Link } from 'react-router-dom';
import PanelBody from '../../../components/PanelBody';
import DateTime from "../../../services/DateTime";

const NotificationsTable = (props) => {
  const { 
    items,
    onShowModalClick,
    onMarkAsReadClick,
    isLoading,
  } = props;

  const reasons = {
    'info': 'info',
    'error': 'danger',
  };

  if (isLoading) {
    return <PanelBody>Loading...</PanelBody>
  }

  if (items.length === 0) {
    return <PanelBody>No notifications</PanelBody>
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Source</th>
            <th>Reason</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            let sourceLink = '';

            if (item.model_type == 'Deploy\\Models\\Project') {
              sourceLink = `/projects/${ item.model_id }`;
            } else if (item.model_type == 'Deploy\\Models\\Server') {
              sourceLink = `/servers/${ item.model_id }/edit`;
            }

            const createdAt = new DateTime(item.created_at);

            return (
              <tr key={ item.id }>
                <td>
                  <span className="small">{ item.model_type } #{ item.model_id }</span><br />
                  <a href="#" onClick={ e => onShowModalClick(item)}>{ item.subject }</a>
                </td>
                <td>
                  <Link to={ sourceLink }>{ sourceLink }</Link>
                </td>
                <td>
                  <span className={`label label-${reasons[item.reason]}`}>
                    { item.reason }
                  </span>
                </td>
                <td>
                  { createdAt.format('Y-m-d h:i:s A') }
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
