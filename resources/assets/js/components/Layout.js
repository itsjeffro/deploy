import React from 'react';
import Drawer from "../components/Drawer";

class Layout extends React.Component {
  render() {
    const { project_name, project_id } = this.props;

    return (
      <div className="wrapper">
        <Drawer
          project_name={project_name}
          project_id={project_id}
        />

        <main className="main-content">
          {this.props.children}
        </main>
      </div>
    )
  }
}

export default Layout;
