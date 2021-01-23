import * as React from 'react';
import Drawer from "./Drawer";
import {NavLink} from "react-router-dom";

class Layout extends React.Component<any> {
  render() {
    return (
      <div className="layout">
        <header>
          <div className="header">
            <div className="header__branding"><h1>Deploy</h1></div>
  
            <div className="header__account">
              <NavLink to={ '/account' } activeClassName="active">My Account</NavLink>
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
