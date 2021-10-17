import * as React from 'react';
import { NavLink } from "react-router-dom";
import Drawer from "./Drawer";
import Deploy  from "../config";

class Layout extends React.Component<any> {
  render() {
    return (
      <div className="layout">
        <header>
          <div className="header">
            <div className="header__branding"><h1>Deploy</h1></div>
  
            <div className="header__account">
              <NavLink to={ '/account' } activeClassName="active">
                { Deploy.auth ? `Welcome, ${Deploy.auth.name}` : 'My Account'}
              </NavLink>
            </div>
          </div>
        </header>
        
        <div className="body">
          <Drawer />
  
          <main className="main-content">
            { this.props.children }
          </main>
        </div>
      </div>
    )
  }
}

export default Layout;
