import * as React from 'react';
import DataGrid from "../../../components/DataGrid/DataGrid";
import PanelBody from "../../../components/PanelBody";

interface PropsInterface {
  projects: any[]
}

const ProjectsTable = (props: PropsInterface) => {
  const { projects } = props;

  const columns = [
    { field: 'name', headerName: 'Project name' },
  ];

  if (projects.length === 0) {
    return <PanelBody>No projects</PanelBody>
  }

  return (
    <DataGrid
      columns={ columns }
      rows={ projects }
    />
  )
};

export default ProjectsTable;
