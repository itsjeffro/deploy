import React from 'react';
import { Link } from "react-router-dom";

const Drawer = (props) => {
  const {
    project,
  } = props;

  const projectNavigation = (project) => {
    if (project === undefined) {
      return <></>;
    }

    return (
      <li>
        <a href="#">{project.name}</a>
        <ul>
          <li>
            <Link to={'/projects/' + project.id}>
              <i className="fa fa-dashboard"></i>Overview
            </Link>
          </li>
          <li>
            <Link to={'/projects/' + project.id + '/environment-unlock'}>
              <i className="fa fa-file-o"></i>Environment
            </Link>
          </li>
          <li>
            <Link to={'/projects/' + project.id + '/deployment-hooks'}>
              <i className="fa fa-cubes"></i>Deployment Hooks
            </Link>
          </li>
          <li>
            <Link to={'/projects/' + project.id + '/folders'}>
              <i className="fa fa-folder"></i>Linked Folders
            </Link>
          </li>
        </ul>
      </li>
    )
  }

  return (
    <div className="drawer">
      <h2>Deploy</h2>
      <ul>
        <li>
          <Link to={'/'}>Dashboard</Link>
        </li>
        { projectNavigation(project) }
      </ul>

      <div className="drawer__account">
        <Link to={'/account'}>My Account</Link>
      </div>
    </div>
  )
};

export default Drawer;