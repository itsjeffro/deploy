import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { createToast } from '../../state/alert/alertActions';
import ProjectServerService from '../../services/ProjectServer';
import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import Panel from '../../components/Panel';
import PanelBody from '../../components/PanelBody';
import Layout from '../../components/Layout';
import {fetchProject} from "../../state/project/actions";
import Container from '../../components/Container';
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';

class ProjectServerEditPage extends React.Component {
  state = {
    isFetching: true,
    isUpdated: false,
    project: {},
    server: {},
    errors: []
  };

  componentDidMount() {
    const {
      dispatch,
      project,
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
      .then(response => {
        this.setState({
          isFetching: false,
          server: response.data
        });
      });
  }

  /**
   * Handle input change when updating a server.
   *
   * @param {object} event
   */
  handleInputChange = (event) => {
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
  handleClick = () => {
    const { dispatch } = this.props;
    const { project_id, server_id } = this.props.match.params;
    const projectServerService = new ProjectServerService;

    projectServerService
      .put(project_id, server_id, this.state.server)
      .then(response => {
        dispatch(createToast('Server updated successfully.'));

        this.setState({isUpdated: true});
      },
      error => {
        let errorResponse = error.response.data;

        errorResponse = errorResponse.hasOwnProperty('errors') ? errorResponse.errors : errorResponse;

        const errors = Object.keys(errorResponse).reduce(function(previous, key) {
          return previous.concat(errorResponse[key][0]);
        }, []);

        this.setState({errors: errors});
      });
  };

  /**
   * Returns edit server form.
   *
   * @param {object} server
   * @param {array} errors
   * @returns {*}
   */
  renderServerEditPanel = (server, errors) => {
    return (
      <Panel>
        <PanelHeading>
          <PanelTitle>Edit Server</PanelTitle>
        </PanelHeading>

        <PanelBody>
          {errors.length ? <AlertErrorValidation errors={errors} /> : ''}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input className="form-control" name="name" type="text" id="name" onChange={this.handleInputChange} value={server.name} />
          </div>
          <div className="row">
            <div className="form-group col-xs-8 col-md-9">
              <label htmlFor="ip_address">Ip Address</label>
              <input className="form-control" name="ip_address" type="text" id="ip_address" onChange={this.handleInputChange} value={server.ip_address} />
            </div>
            <div className="form-group col-xs-4 col-md-3">
              <label htmlFor="port">Port</label>
              <input className="form-control" name="port" type="text" id="port" onChange={this.handleInputChange} value={server.port} placeholder="22" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="connect_as">Connect As</label>
            <input className="form-control" name="connect_as" type="text" id="connect_as" onChange={this.handleInputChange} value={server.connect_as} />
          </div>
          <div className="form-group">
            <label htmlFor="project_path">Project Path</label>
            <input className="form-control" name="project_path" type="text" id="project_path" onChange={this.handleInputChange} value={server.project_path} />
          </div>

          <Button
            color="primary"
            onClick={this.handleClick}
          >Save Server</Button>
        </PanelBody>
      </Panel>
    )
  };

  render() {
    const { project } = this.props;
    const {
      server,
      isFetching,
      isUpdated,
      errors
    } = this.state;

    if (isUpdated) {
      return <Redirect to={'/projects/' + project.item.id} />
    }

    return (
      <Layout project={ project.item }>
        <ProjectHeading project={ project.item } />

        <div className="content">
          <Container fluid>
            {isFetching ? <Loader /> : this.renderServerEditPanel(server, errors)}
          </Container>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    project: state.project,
  };
};

export default connect(
  mapStateToProps
)(ProjectServerEditPage);
