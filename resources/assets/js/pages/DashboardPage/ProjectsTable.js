import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../../components/Icon'

const ProjectsTable = (props) => {
  const {
    projects
  } = props;

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
                {project.last_deployment.created_at ? project.last_deployment.created_at : 'N/A'}
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