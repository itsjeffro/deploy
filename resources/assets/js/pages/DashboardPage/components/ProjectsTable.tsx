import * as React from 'react';
import { Link } from 'react-router-dom';
import DataGrid from '../../../components/DataGrid/DataGrid';

import Icon from '../../../components/Icon'

const ProjectsTable = (props) => {
  const {
    isFetching,
    projects
  } = props;

  if (isFetching) {
    return <div className="panel-body">Loading ...</div>;
  }

  if (!isFetching && projects.length === 0) {
    return <div className="panel-body">Add a project to get started!</div>;
  }

  const lastDeployment = (project: any) => {
    if (project.last_deployment.duration === null) {
      return 'N/A';
    }

    if (project.last_deployment.status === 0) {
      return (
        <span className="text-danger" title="Failed deployment">
          <Icon iconName="times" /> {project.last_deployment.created_at}
        </span>
      );
    }

    return project.last_deployment.created_at;
  };

  const repositoryType = (project: any) => (
    <>
      <Icon iconName={ project.provider.friendly_name } /> {project.repository}
    </>
  );

  const columns = [
    { field: 'name', headerName: 'Name' },
    { field: 'repository', headerName: 'Repository' },
    { field: 'last_deployed', headerName: 'Last Deployed' },
    { field: 'actions', headerName: '', align: 'right' },
  ];

  const rows = projects.map((project: any) => {
    return {
      name: <strong><Link to={ '/projects/' + project.id }>{ project.name }</Link></strong>,
      repository: repositoryType(project),
      last_deployed: lastDeployment(project),
      actions: <Link className="btn btn-default" to={ '/projects/' + project.id }>Setup</Link>,
    };
  });

  return (
    <div className="table-responsive">
      <DataGrid columns={ columns } rows={ rows } />
    </div>
  )
}

export default ProjectsTable;