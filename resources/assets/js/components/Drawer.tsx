import * as React from 'react';
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
          <NavLink to={'/'} activeClassName="active">
            <Icon iconName="desktop" />Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/notifications" activeClassName="active">
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
