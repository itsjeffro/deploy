import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { createToast } from '../../state/alert/alertActions';
import { fetchProject, updateProjectServer } from '../../state/project/actions';
import Loader from '../../components/Loader';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';
import ServerEditForm from './components/ServerEditForm';
import ServerModelInterface from '../../interfaces/model/ServerModelInterface';
import ProjectModelInterface from '../../interfaces/model/ProjectModelInterface';

class ProjectServerEditPage extends React.Component<any> {
  state = {
    project: {},
    serverId: null,
    server: {},
    isUpdated: false,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: {
          server_id,
          project_id,
        }
      }
    } = this.props;

    dispatch(fetchProject(project_id));

    this.setState({ serverId: server_id });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { serverId } = this.state;
    const { dispatch, project } = this.props;

    // Handle project change
    if (project.item !== nextProps.project.item) {
      const server = this.getProjectServerById(nextProps.project.item, parseInt(serverId))

      this.setState({ server: server });
    }

    // Handler project server update
    if (nextProps.project.isUpdated !== project.isUpdated && nextProps.project.isUpdated) {
      this.setState({ isUpdated: true });

      dispatch(createToast('Server updated successfully.'));
    }
  }

  /**
   * Handle input change when updating a server.
   */
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    let server = Object.assign({}, this.state.server);
    server[name] = value;

    this.setState({server: server});
  };

  /**
   * Handles updating a server.
   */
  handleClick = (): void => {
    const { 
      dispatch,
      match: {
        params: {
          project_id, 
          server_id,
        },
      },
    } = this.props;

    const { server } = this.state;

    dispatch(updateProjectServer(project_id, server_id, server));
  };

  /**
   * Returns the the project's specified server by its server id.
   */
  public getProjectServerById(project: ProjectModelInterface, serverId: number): any {
    const projectServers = project.servers || [];

    const filteredServers = projectServers.filter((server: ServerModelInterface) => {
      return server.id === serverId;
    });

    return filteredServers[0] || {};
  }

  render() {
    const { project } = this.props;
    const { server, isUpdated } = this.state;

    if (isUpdated) {
      return <Redirect to={ `projects/${ project.id }`} />
    }

    return (
      <Layout project={ project.item }>
        <ProjectHeading project={ project.item } />

        <div className="content">
          <Container fluid>
            { project.isFetching ? 
              <Loader /> : 
              <ServerEditForm 
                isUpdating={ project.isUpdating }
                server={ server } 
                onClick={ this.handleClick } 
                onInputChange={ this.handleInputChange }
                errors={ project.errors }
              /> 
            }
          </Container>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    project: state.project,
  };
};

export default connect(
  mapStateToProps
)(ProjectServerEditPage);
