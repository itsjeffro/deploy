import React from 'react';
import { Link } from 'react-router-dom';
import { Deploy } from '../../../config';

import Button from '../../../components/Button';
import Icon from '../../../components/Icon';

const ServersTableRow = props => {
    const {
        server,
        onServerConnectionTestClick,
        onServerRemoveClick,
        onServerKeyClick
    } = props;

    let status = <span><i className="status-circle text-warning"></i> Unknown</span>;

    if (server.connection_status === 0) {
        status = <span><i className="status-circle text-danger"></i> Failed <Icon iconName="refresh fa-fw"/></span>;
    } else if (server.connection_status === 1) {
        status = <span><i className="status-circle text-success"></i> Successful <Icon iconName="refresh fa-fw"/></span>;
    } else if (server.connection_status === 2) {
        status = <span><i className="status-circle text-warning"></i> Connecting <Icon iconName="refresh fa-fw fa-spin"/></span>;
    } else {
        status = <span><i className="status-circle text-warning"></i> Unknown <Icon iconName="refresh fa-fw"/></span>;
    }

    return (
        <tr>
            <td>{server.name}</td>
            <td>{server.connect_as}</td>
            <td>{server.ip_address}</td>
            <td>{server.port}</td>
            <td>{server.project_path}</td>
            <td>
                <a
                    className="status-text"
                    href="#"
                    onClick={e => onServerConnectionTestClick(e, server.id)}
                >{status}</a>
            </td>
            <td className="text-right">
                <Link
                    className="btn btn-default"
                    style={{marginRight: 5}}
                    to={'/projects/' + server.project_id + '/servers/' + server.id + '/edit'}
                >Edit</Link>

                <Button
                    color="default"
                    style={{marginRight: 5}}
                    onClick={() => onServerKeyClick(server)}
                ><Icon iconName="key" /></Button>

                <Button
                    color="default"
                    onClick={() => onServerRemoveClick(server)}
                ><Icon iconName="times" /></Button>
            </td>
        </tr>
    )
}

export default ServersTableRow;