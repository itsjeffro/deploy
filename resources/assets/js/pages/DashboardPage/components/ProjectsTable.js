import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../../../components/Icon'

const ProjectsTable = (props) => {
  const {
    isFetching,
    projects
  } = props;

  if (isFetching) {
    return <div className="panel-body">Loading ...</div>;
  }

  if (!isFetching && projects.length === 0) {
    return <div className="panel-body">Add a project to get started!</div>;
  }

  const lastDeployment = (project) => {
    if (project.last_deployment.duration === null) {
      return 'N/A';
    }

    if (project.last_deployment.status === 0) {
      return (
        <span className="text-danger" title="Failed deployment">
          <Icon iconName="times" /> {project.last_deployment.created_at}
        </span>
      );
    }

    return project.last_deployment.created_at;
  };

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Repository</th>
            <th>Last Deployed</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>
                <strong>
                  <Link to={'/projects/' + project.id}>{project.name}</Link>
                </strong>
              </td>
              <td>
                <Icon iconName={project.provider.friendly_name} /> {project.repository}
              </td>
              <td>
                {lastDeployment(project)}
              </td>
              <td className="text-right">
                <Link className="btn btn-default" to={'/projects/' + project.id}>Setup</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProjectsTable;