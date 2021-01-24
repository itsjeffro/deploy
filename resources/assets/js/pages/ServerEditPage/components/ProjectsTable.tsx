import * as React from 'react';
import { Link } from "react-router-dom";
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

  const rows = projects.map((project) => {
    return {
      name: <Link to={ `/projects/${ project.id }` }>{ project.name }</Link>
    }
  })

  if (projects.length === 0) {
    return <PanelBody>No projects</PanelBody>
  }

  return (
    <DataGrid
      columns={ columns }
      rows={ rows }
    />
  )
};

export default ProjectsTable;
