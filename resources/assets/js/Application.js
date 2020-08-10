import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Alert from "./containers/Alert";
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import ProjectDeploymentPage from './pages/ProjectDeploymentPage';
import ProjectEditPage from './pages/ProjectEditPage';
import ProjectSourceControlEditPage from './pages/ProjectSourceControlEditPage';
import ProjectEnvironmentUnlockPage from './pages/ProjectEnvironmentUnlockPage';
import ProjectEnvironmentResetPage from './pages/ProjectEnvironmentResetPage';
import ProjectServerCreatePage from './pages/ProjectServerCreatePage';
import ProjectServerEditPage from './pages/ProjectServerEditPage';
import ProjectLinkedFolderCreatePage from './pages/ProjectLinkedFolderCreatePage';
import ProjectActionPage from './pages/ProjectActionPage';
import ProjectDeploymentHookPage from './pages/ProjectDeploymentHookPage';
import ProjectLinkedFolderPage from './pages/ProjectLinkedFolderPage';
import AccountPage from './pages/AccountPage';
import NotificationsPage from './pages/NotificationsPage';

class Application extends React.Component {
  render() {
    let baseName = Deploy.path.replace(/\/+$/, "");

    baseName = "/" + baseName;

    return (
      <Router basename={ baseName }>
        <>
          <Switch>
            <Route exact path="/" component={ DashboardPage } />
            <Route path="/notifications" component={ NotificationsPage } />
            <Route path="/projects/:project_id/deployment-hooks/actions/:action_id" component={ ProjectActionPage} />
            <Route path="/projects/:project_id/deployment-hooks" component={ ProjectDeploymentHookPage} />
            <Route path="/projects/:project_id/servers/create" component={ ProjectServerCreatePage} />
            <Route path="/projects/:project_id/servers/:server_id/edit" component={ ProjectServerEditPage} />
            <Route path="/projects/:project_id/environment-unlock" component={ ProjectEnvironmentUnlockPage} />
            <Route path="/projects/:project_id/environment-reset" component={ ProjectEnvironmentResetPage} />
            <Route path="/projects/:project_id/deployments/:deployment_id" component={ ProjectDeploymentPage} />
            <Route path="/projects/:project_id/folders/create" component={ ProjectLinkedFolderCreatePage} />
            <Route path="/projects/:project_id/folders" component={ ProjectLinkedFolderPage} />
            <Route path="/projects/:project_id/settings/source-control" component={ ProjectSourceControlEditPage} />
            <Route path="/projects/:project_id/settings" component={ ProjectEditPage} />
            <Route path="/projects/:project_id" component={ ProjectPage} />
            <Route path="/account" component={ AccountPage} />
          </Switch>
          <Alert/>
        </>
      </Router>
    )
  }
}

export default Application;