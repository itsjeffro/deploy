import * as React from 'react';
import { Link } from 'react-router-dom';

import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import ServerModelInterface from '../../../interfaces/model/ServerModelInterface';
import ServerConnection from "./ServerConnection";

const ServersTableRow = (props: PropsInterface) => {
  const {
    projectId,
    projectServer,
    onServerConnectionTestClick,
    onServerRemoveClick,
    onServerKeyClick,
  } = props;

  return (
    <tr>
      <td>{ projectServer.server.name }</td>
      <td>{ projectServer.server.connect_as }</td>
      <td>{ projectServer.server.ip_address }</td>
      <td>{ projectServer.server.port }</td>
      <td>{ projectServer.project_path }</td>
      <td>
        <a
          className="status-text"
          href="#"
          onClick={ (e) => onServerConnectionTestClick(e, projectServer.server_id) }
        ><ServerConnection server={ projectServer.server } /></a>
      </td>
      <td className="text-right">
        <Link
          className="btn btn-default"
          style={ { marginRight: 5 } }
          to={ '/projects/' + projectId + '/servers/' + projectServer.server_id + '/edit' }
        >Edit</Link>

        <Button
          color="default"
          style={ { marginRight: 5 } }
          onClick={ () => onServerKeyClick(projectServer.server) }
        ><Icon iconName="key" /></Button>

        <Button
          color="default"
          onClick={ () => onServerRemoveClick(projectServer.server) }
        ><Icon iconName="times" /></Button>
      </td>
    </tr>
  )
}

interface PropsInterface {
  projectId: number
  projectServer: any
  onServerConnectionTestClick: any
  onServerRemoveClick: any
  onServerKeyClick: any
}

export default ServersTableRow;
