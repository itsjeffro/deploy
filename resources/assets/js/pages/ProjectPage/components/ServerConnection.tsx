import * as React from 'react';
import Icon from "../../../components/Icon";

const ServerConnection = (props) => {
  const { server } = props;
  const FAILED_STATUS = 0;
  const SUCCESSFUL_STATUS = 1;
  const CONNECTING_STATUS = 2

  if (server.connection_status === FAILED_STATUS) {
    return (
      <span>
        <i className="status-circle text-danger">{ '' }</i> Failed <Icon iconName="refresh fa-fw"/>
      </span>
    );
  }

  if (server.connection_status === SUCCESSFUL_STATUS) {
    return (
      <span>
        <i className="status-circle text-success">{ '' }</i> Successful <Icon iconName="refresh fa-fw"/>
      </span>
    );
  }

  if (server.connection_status === CONNECTING_STATUS) {
    return (
      <span>
        <i className="status-circle text-warning">{ '' }</i> Connecting <Icon iconName="refresh fa-fw fa-spin"/>
      </span>
    );
  }

  return (
    <span>
      <i className="status-circle text-warning">{ '' }</i> Unknown <Icon iconName="refresh fa-fw"/>
    </span>
  );
}

export default ServerConnection;
