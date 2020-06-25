import React from 'react';

import Panel from '../../../components/Panel'; 
import PanelHeading from '../../../components/PanelHeading'; 
import PanelTitle from '../../../components/PanelTitle'; 

const DeploymentDetails = props => {
    const { project } = props;
    
    let lastDeploymentDuration = project.last_deployment ? project.last_deployment.duration : null;
    let duration = 'N/A';
    
    if (lastDeploymentDuration === 1) {
        duration = lastDeploymentDuration + ' second';
    } else if (lastDeploymentDuration === 0 || lastDeploymentDuration > 1) {
        duration = lastDeploymentDuration + ' seconds';
    }

    return (
        <Panel>
            <PanelHeading>
                <PanelTitle>Deployment Details</PanelTitle>
            </PanelHeading>

            <ul className="list-group">
                <li className="list-group-item">
                    Today
                    <div className="pull-right">
                        {project.daily_deployments_count}
                    </div>
                </li>
                <li className="list-group-item">
                    This Week
                    <div className="pull-right">
                        {project.weekly_deployments_count}
                    </div>
                </li>
                <li className="list-group-item">
                    Last Duration
                    <div className="pull-right">
                        {duration}
                    </div>
                </li>
            </ul>
        </Panel>
    )
}

export default DeploymentDetails;