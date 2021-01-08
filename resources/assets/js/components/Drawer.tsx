import * as React from 'react';
import { NavLink } from "react-router-dom";
import Icon from './Icon';

const Drawer = (props) => {
  const {
    project,
  } = props;

  return (
    <div className="drawer">
      <ul>
        <li>
          <NavLink to="/" activeClassName="active" exact>
            <Icon iconName="desktop" />Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/servers" activeClassName="active" exact>
            <Icon iconName="server" />Servers
          </NavLink>
        </li>
        <li>
          <NavLink to="/notifications" activeClassName="active" exact>
            <Icon iconName="bell" />Notifications
          </NavLink>
        </li>
      </ul>
    </div>
  )
};

export default Drawer;
