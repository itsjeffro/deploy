import React from 'react';
import { NavLink } from "react-router-dom";
import Icon from '../Icon';

const ProjectNavigation = (props) => {
  const {
    project,
  } = props;

  return (
    <ul className="project-navigation">
      <li>
        <NavLink to={'/projects/' + project.id} activeClassName="active" exact>
          <i className="fa fa-dashboard"></i>Overview
        </NavLink>
      </li>
      <li>
        <NavLink to={'/projects/' + project.id + '/environment-unlock'} activeClassName="active">
          <i className="fa fa-file-o"></i>Environment
        </NavLink>
      </li>
      <li>
        <NavLink to={'/projects/' + project.id + '/deployment-hooks'} activeClassName="active">
          <i className="fa fa-cubes"></i>Deployment Hooks
        </NavLink>
      </li>
      <li>
        <NavLink to={'/projects/' + project.id + '/folders'} activeClassName="active">
          <i className="fa fa-folder"></i>Linked Folders
        </NavLink>
      </li>
      <li>
        <NavLink to={'/projects/' + project.id + '/settings'} activeClassName="active">
          <Icon iconName="gear" />Settings
        </NavLink>
      </li>
    </ul>
  )
}

export default ProjectNavigation;
