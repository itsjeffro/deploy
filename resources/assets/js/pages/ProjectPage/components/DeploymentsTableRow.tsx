import * as React from 'react';
import { Link } from 'react-router-dom';

import Button from '../../../components/Button';
import Icon from '../../../components/Icon';

const DeploymentsTableRow = (props) => {
  const {
    deployment,
    onRedeployClick
  } = props;

  let committer = <span>--</span>;
  let commit = <span>-- ({deployment.branch})</span>;
  let status = <span>Queued</span>;

  if (deployment.committer) {
    committer = <span><img className="avatar" src={deployment.committer_avatar} height="30" width="30"/> {deployment.committer}</span>;
  }

  if (deployment.commit) {
    commit = <span><a href={deployment.commit_url} target="_blank">{deployment.commit.substr(0,7)}</a> ({deployment.branch})</span>;
  }

  if (deployment.status === 0) {
    status = <span className="text-danger"><i className="fa fa-times"></i> Failed</span>;
  } else if (deployment.status === 3) {
    status = <span><i className="fa fa-spinner fa-spin"></i>  Deploying</span>;
  } else if (deployment.status === 1) {
    status = <span className="text-success"><i className="fa fa-check"></i> Deployed</span>;
  }

  return (
    <tr>
      <td>{ deployment.started_at }</td>
      <td>{ committer }</td>
      <td>{ commit }</td>
      <td className="deployment-status text-center">
        { status }
      </td>
      <td className="text-right">
        <Button
          color="default"
          onClick={ (event) => onRedeployClick(deployment) }
          title="Redploy Commit"
        ><Icon iconName="cloud-upload" /></Button>

        <Link
          style={ {marginLeft: 5} }
          className="btn btn-default"
          to={ `/projects/${ deployment.project_id }/deployments/${ deployment.id }` }
        ><Icon iconName="info-circle" /> Info</Link>
      </td>
    </tr>
  )
}

export default DeploymentsTableRow;
