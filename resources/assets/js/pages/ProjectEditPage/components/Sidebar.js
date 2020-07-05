import React from 'react';
import { NavLink } from 'react-router-dom';

import Panel from '../../../components/Panel';
import PanelHeading from '../../../components/PanelHeading';
import PanelTitle from '../../../components/PanelTitle'; 


const Sidebar = (props) => {
  const {project} = props;

  return (
    <Panel>
      <PanelHeading>
        <PanelTitle>Project settings</PanelTitle>
      </PanelHeading>

      <div className="list-group">
        <NavLink 
          to={'/projects/' + project.id + '/settings'} 
          className="list-group-item"
          activeClassName="active"
          exact
        >General settings</NavLink>
        <NavLink 
          to={'/projects/' + project.id + '/settings/source-control'} 
          className="list-group-item"
          activeClassName="active"
          exact
        >Source control</NavLink>
      </div>
    </Panel>
  )
};

export default Sidebar;