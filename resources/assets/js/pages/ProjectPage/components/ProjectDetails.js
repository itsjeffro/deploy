import React from 'react';

import Panel from '../../../components/Panel';
import PanelHeading from '../../../components/PanelHeading';
import PanelTitle from '../../../components/PanelTitle'; 
import Icon from '../../../components/Icon';

const ProjectDetails = props => {
  const { project } = props;
  let repositoryUrl = '';
  let providerIcon = '';

  if (project.provider) {
    repositoryUrl = project.provider.url + project.repository;
    providerIcon = project.provider.friendly_name;
  }

  return (
    <Panel>
      <PanelHeading>
      	<PanelTitle>Project Details</PanelTitle>
      </PanelHeading>

      <ul className="list-group">
        <li className="list-group-item">
          Repository

          <div className="pull-right">
            <Icon iconName={providerIcon} /> <a 
              href={repositoryUrl} 
              target="_blank" 
              title="Go to repository"
            >
              {project.repository}
            </a>
          </div>
        </li>
        <li className="list-group-item">
          Deploy Branch

          <div className="pull-right">
            <span className="label label-info">{project.branch}</span>
          </div>
        </li>
        <li className="list-group-item">
          Deploy on code push

          <div className="pull-right">
            {project.deploy_on_push ? "On" : "Off"}
          </div>
        </li>
      </ul>
    </Panel>
  );
};

export default ProjectDetails;