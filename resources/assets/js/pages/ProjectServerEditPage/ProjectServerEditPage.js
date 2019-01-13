import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { Deploy } from '../../config';

import ProjectServerService from '../../services/ProjectServer';

import AlertErrorValidation from '../../components/AlertErrorValidation'; 
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Loader from '../../components/Loader';
import Panel from '../../components/Panel';
import PanelBody from '../../components/PanelBody';

class ProjectServerEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      isUpdated: false,
      project: {},
      server: {},
      errors: []
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const { project } = this.props;
    const { server_id } = this.props.match.params;
    const projectServerService = new ProjectServerService;

    this.setState({project: project});

    projectServerService
      .get(project.id, server_id)
      .then(response => {
        this.setState({
          isFetching: false,
          server: response.data
        });
      });
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    let server = Object.assign({}, this.state.server);
    server[name] = value;

    this.setState({server: server});
  }

  handleClick() {
    const { project_id, server_id } = this.props.match.params;
    const projectServerService = new ProjectServerService;

    projectServerService
      .put(project_id, server_id, this.state.server)
      .then(response => {
        this.setState({isUpdated: true});
      },
      error => {
      	const errorResponse = error.response.data;
    	
    	const errors = Object.keys(errorResponse).reduce(function(previous, key) {
		  return previous.concat(errorResponse[key][0]);
		}, []);
    	
        this.setState({errors: errors});
      });
  }

  renderServerEditPanel(server, errors) {
    return (
      <Panel>
        <PanelBody>
          <h4>Server details</h4>
          
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
  }

  render() {
    const {
      project,
      server,
      isFetching,
      isUpdated,
      errors
    } = this.state;

    if (isUpdated) {
      return <Redirect to={Deploy.path + '/projects/' + project.id} />
    }

    return (
      <div>
        <div className="breadcrumbs">
          <div className="container">
            <div className="pull-left">
              <span className="heading">
                <Link to={Deploy.path + '/projects/' + project.id}>{project.name}</Link> <Icon iconName="angle-double-right" /> Edit Server
              </span>
            </div>
          </div>
        </div>

        <div className="container content">
          {isFetching ? <Loader /> : this.renderServerEditPanel(server, errors)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state.project;
};

export default connect(
  mapStateToProps
)(ProjectServerEditPage);