import React from 'react';
import { NavLink } from "react-router-dom";
import Icon from './Icon';

const Drawer = (props) => {
  const {
    project,
  } = props;

  return (
    <div className="drawer">
      <h2>Deploy</h2>
      <ul>
        <li>
          <NavLink to={'/'} activeClassName="active" exact>
            <Icon iconName="desktop" />Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to={'/servers'} activeClassName="active" exact>
            <i className="fa fa-server"></i>Servers
          </NavLink>
        </li>
        <li>
          <NavLink to="/notifications" activeClassName="active" exact>
            <Icon iconName="bell" />Notifications
          </NavLink>
        </li>
      </ul>

      <div className="drawer__account">
        <NavLink to={'/account'} activeClassName="active">My Account</NavLink>
      </div>
    </div>
  )
};

export default Drawer;