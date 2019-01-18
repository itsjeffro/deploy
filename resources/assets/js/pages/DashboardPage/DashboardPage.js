import React from 'react';

import ProjectService from '../../services/Project';
import AccountProviderService from '../../services/AccountProvider';

import ProjectsTable from './ProjectsTable';

import Icon from '../../components/Icon';
import Dialog from '../../components/Dialog';
import DialogTitle from '../../components/DialogTitle';
import DialogContent from '../../components/DialogContent';
import DialogActions from '../../components/DialogActions';
import TextField from '../../components/TextField';
import Button from '../../components/Button';

class DashboardPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetching: true,
            projects: [],
            grantedProviders: [],
            errors: {},
            input: {}
        }

        this.handleInputClick = this.handleInputClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDismissModal = this.handleDismissModal.bind(this);
    }

    componentWillMount() {
        let projectService = new ProjectService;

        projectService
            .index()
            .then(response => {
                let projects = response.data;

                this.setState({
                    isFetching: false,
                    projects: projects
                });
            });

        let accountProviderService = new AccountProviderService;

        accountProviderService
          .index('/api/account-providers')
          .then(response => {
              let providers = response.data.filter(provider => {
                return provider.deploy_access_token;
              });
  
              this.setState({grantedProviders: providers});
          });
    }

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

    handleInputClick(event) {
        event.preventDefault();

        let projectService = new ProjectService;

        projectService
            .post(this.state.input)
            .then(response => {
                $('#project-create-modal').modal('hide');

                let projects = this.state.projects.concat(response.data);

                this.setState({
                    projects: projects,
                    errors: {}
                });
            },
            error => {
                this.setState({errors: error.response.data});
            });
    }

    handleDismissModal(event) {
        $('#project-create-modal').modal('hide');
    }

    render() {
        let projectContent = <div className="panel-body">Loading ...</div>;

        if (!this.state.isFetching && this.state.projects.length === 0) {
            projectContent = <div className="panel-body">Add a project to get started!</div>;
        }

        if (!this.state.isFetching && this.state.projects.length > 0) {
            projectContent = <div className="table-responsive"><ProjectsTable projects={this.state.projects} /></div>
        }

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
                        {projectContent}
                    </div>
                </div>

                <Dialog id="project-create-modal">
                    <DialogTitle showCloseButton={true}>
                        Add Project
                    </DialogTitle>
                    <DialogContent>
                        <h4>Project Details</h4>
                        <div className={'form-group' + (this.state.errors.hasOwnProperty('name') ? ' has-error' : '')}>
                            <TextField id="name" label="Project Name" onChange={this.handleInputChange} name="name" />
                            {this.state.errors.hasOwnProperty('name') ?  <span className="help-block"><strong>{this.state.errors.name[0]}</strong></span> : ''}
                        </div>

                        <h4>Source Control</h4>
                        <div className={'form-group' + (this.state.errors.hasOwnProperty('provider_id') ? ' has-error' : '')}>
                            <label>Providers</label>
                            {this.state.errors.hasOwnProperty('provider_id') ?  <span className="help-block"><strong>{this.state.errors.provider_id[0]}</strong></span> : ''}

                            {this.state.grantedProviders.map(grantedProvider => (
                                <div key={grantedProvider.id}>
                                    <label htmlFor={grantedProvider.name}>
                                        <input name="provider_id"
                                            type="radio"
                                            value={grantedProvider.id}
                                            id={grantedProvider.name}
                                            onChange={this.handleInputChange}
                                        /> {grantedProvider.name}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className={'form-group' + (this.state.errors.repository ? ' has-error' : '')}>
                            <TextField id="repository" label="Respository" onChange={this.handleInputChange} name="repository" />
                            {this.state.errors.repository ?  <span className="help-block"><strong>{this.state.errors.repository[0]}</strong></span> : ''}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDismissModal}>Cancel</Button>
                        <Button color="primary" onClick={this.handleInputClick}>Add Project</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default DashboardPage;