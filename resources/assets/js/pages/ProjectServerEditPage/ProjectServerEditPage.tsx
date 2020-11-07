import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { createToast } from '../../state/alert/alertActions';
import ProjectServerService from '../../services/ProjectServer';
import Loader from '../../components/Loader';
import Layout from '../../components/Layout';
import {fetchProject} from "../../state/project/actions";
import Container from '../../components/Container';
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';
import ServerEditForm from './components/ServerEditForm';

class ProjectServerEditPage extends React.Component<any> {
  state = {
    isFetching: true,
    isUpdated: false,
    project: {},
    server: {},
    errors: [],
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

    const projectServerService = new ProjectServerService;

    dispatch(fetchProject(project_id));

    projectServerService
      .get(project_id, server_id)
      .then((response) => {
        this.setState({
          isFetching: false,
          server: response.data,
        });
      });
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
    const { dispatch } = this.props;
    const { project_id, server_id } = this.props.match.params;
    const projectServerService = new ProjectServerService;

    projectServerService
      .put(project_id, server_id, this.state.server)
      .then((response) => {
        dispatch(createToast('Server updated successfully.'));

        this.setState({isUpdated: true});
      },
      (error) => {
        let errorResponse = error.response.data;

        errorResponse = errorResponse.hasOwnProperty('errors') ? errorResponse.errors : errorResponse;

        const errors = Object.keys(errorResponse).reduce(function(previous, key) {
          return previous.concat(errorResponse[key][0]);
        }, []);

        this.setState({errors: errors});
      });
  };

  render() {
    const { project } = this.props;
    const { server, isFetching, isUpdated, errors } = this.state;

    if (isUpdated) {
      return <Redirect to={ '/projects/' + project.item.id } />
    }

    return (
      <Layout project={ project.item }>
        <ProjectHeading project={ project.item } />

        <div className="content">
          <Container fluid>
            { isFetching ? 
              <Loader /> : 
              <ServerEditForm 
                server={ server } 
                onClick={ this.handleClick } 
                onInputChange={ this.handleInputChange }
                errors={ errors }
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
