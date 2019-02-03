import React from 'react';
import {Link} from 'react-router-dom';

import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle'; 


const Sidebar = (props) => {
  const {project} = props;

  return (
    <Panel>
      <PanelHeading>
        <PanelTitle>Project settings</PanelTitle>
      </PanelHeading>

      <div className="list-group">
        <Link 
          to={'/projects/' + project.id + '/edit'} 
          className="list-group-item"
        >General settings</Link>
        <Link 
          to={'/projects/' + project.id + '/source-control/edit'} 
          className="list-group-item"
        >Source control</Link>
      </div>
    </Panel>
  )
};

export default Sidebar;