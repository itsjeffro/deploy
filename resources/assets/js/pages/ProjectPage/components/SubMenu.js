import React from 'react';
import { NavLink } from 'react-router-dom';
import { Deploy } from '../../../config';

const SubMenu = (props) => {
  const { project } = props;

  return (
    <div className="container content submenu">
      <ul>
        <li><NavLink activeClassName="active" to={'/projects/' + project.id}>Project Overview</NavLink></li>
        <li><NavLink activeClassName="active" to={'/projects/' + project.id + '/environment-unlock'}>Environment</NavLink></li>
        <li><NavLink activeClassName="active" to={'/projects/' + project.id + '/deployment-hooks'}>Deployment Hooks</NavLink></li>
        <li><NavLink activeClassName="active" to={'/projects/' + project.id + '/folders'}>Linked Folders</NavLink></li>
      </ul>
    </div>
  )
};

export default SubMenu;