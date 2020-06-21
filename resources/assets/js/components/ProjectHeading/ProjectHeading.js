import React from 'react';
import Container from '../Container';
import ProjectNavigation from './ProjectNavigation';

const ProjectHeading = (props) => {
  const {
    project,
  } = props;

  return (
    <div className="project-heading">
      <Container fluid>
        <div className="pull-left">
          <h2>{project.name}</h2>
        </div>

        <div className="pull-right">
          { props.children }
        </div>

        <div className="clearfix"></div>

        <ProjectNavigation project={ project } />
      </Container>
    </div>
  )
}

export default ProjectHeading;
