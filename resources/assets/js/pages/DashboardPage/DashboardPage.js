import React from 'react';
import { connect } from 'react-redux';

import AccountProviderService from '../../services/AccountProvider';
import {fetchProjects, createProjects} from '../../actions/projects';

import ProjectsTable from './ProjectsTable';

import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import Dialog from '../../components/Dialog';
import DialogTitle from '../../components/DialogTitle';
import DialogContent from '../../components/DialogContent';
import DialogActions from '../../components/DialogActions';
import Icon from '../../components/Icon';
import TextField from '../../components/TextField';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grantedProviders: [],
      input: {}
    };

    this.handleCreateProjectClick = this.handleCreateProjectClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDismissModalClick = this.handleDismissModalClick.bind(this);
  }

  /**
   * Fetch data for projects and providers.
   */
  componentWillMount() {
    const {
      dispatch,
      projects
    } = this.props;

    let accountProviderService = new AccountProviderService;

    if (typeof projects.items === 'object' && projects.items.length === 0) {
      dispatch(fetchProjects());
    }

    accountProviderService
      .index('/api/account-providers')
      .then(response => {
        let providers = response.data.filter(provider => {
          return provider.deploy_access_token;
        });
  
        this.setState({grantedProviders: providers});
      });
  }

  /**
   * Handle input change from the project add form.
   *
   * @param {object} event
   */
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let input = Object.assign({}, this.state.input);
    input[name] = value;

    this.setState({
      input: input
    });
  }

  /**
   * Handle click for submitting the create project form.
   */
  handleCreateProjectClick() {
    const {
      dispatch,
      projects
    } = this.props;

    dispatch(createProjects(this.state.input));

    if (projects.isCreated && projects.errors.length < 1) {
      $('#project-create-modal').modal('hide');

      this.setState({input: {}});
    }
  }

  /**
   * Handle click for dismissing the creat project modal.
   *
   * @param {object} event
   */
  handleDismissModalClick(event) {
    $('#project-create-modal').modal('hide');
  }

  render() {
    const {projects} = this.props;

    return (
      <div>
        <div className="breadcrumbs">
          <div className="container">
            <div className="pull-left">
              <span className="heading">Project List</span>
            </div>
            <div className="pull-right">
              <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#project-create-modal">
                <Icon iconName="plus" /> Add Project
              </button>
            </div>
          </div>
        </div>

        <div className="container content">
          <div className="panel panel-default">
            <ProjectsTable
              isFetching={projects.isFetching}
              projects={projects.items}
            />
          </div>
        </div>

        <Dialog id="project-create-modal">
          <DialogTitle>
            Add Project
          </DialogTitle>
          <DialogContent>
            {projects.errors.length ? <AlertErrorValidation errors={projects.errors} /> : ''}

            <h4>Project Details</h4>
            <div className="form-group">
              <TextField 
                id="name" 
                label="Project Name" 
                onChange={this.handleInputChange} 
                name="name"
              />
            </div>

            <h4>Source Control</h4>
            <div className="form-group">
              <label>Providers</label>

              {this.state.grantedProviders.map(grantedProvider => (
                <div key={grantedProvider.id}>
                  <label htmlFor={grantedProvider.name}>
                    <input 
                      name="provider_id"
                      type="radio"
                      value={grantedProvider.id}
                      id={grantedProvider.name}
                      onChange={this.handleInputChange}
                    /> {grantedProvider.name}
                  </label>
                </div>
              ))}
            </div>

            <div className="form-group">
              <TextField 
                id="repository" 
                label="Respository" 
                onChange={this.handleInputChange} 
                name="repository"
                placeholder="user/repository"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleDismissModalClick}
            >Cancel</Button>

            <Button
              color="primary"
              onClick={this.handleCreateProjectClick}
            >{projects.isCreating ? 'Working...' : 'Add Project'}</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
  
const mapStateToProps = (state) => {
  return {
    projects: state.projects
  };
};

export default connect(
  mapStateToProps		
)(DashboardPage);