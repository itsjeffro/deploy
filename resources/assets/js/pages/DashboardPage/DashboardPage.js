import React from 'react';
import { connect } from 'react-redux';

import { fetchProjects, createProjects } from '../../state/projects/projectsActions';
import AccountProviderService from '../../services/AccountProvider';
import AddProjectDialog from './AddProjectDialog';
import Icon from '../../components/Icon';
import Panel from '../../components/Panel';
import ProjectsTable from './ProjectsTable';
import Layout from "../../components/Layout";

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

    this.setState({input: input});
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
  }

  /**
   * Handle click for dismissing the creat project modal.
   */
  handleDismissModalClick() {
    $('#project-create-modal').modal('hide');
  }

  render() {
    const { projects } = this.props;

    const items = Object.keys(projects.items).map(key => {
      return projects.items[key];
    });
    
    if (projects.isCreating) {
      $('#project-create-modal').modal('hide');
    }

    return (
      <Layout>
        <div className="content">
          <div className="container-fluid heading">
            <div className="pull-left">
              <h2>Project List</h2>
            </div>
            <div className="pull-right">
              <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#project-create-modal">
                <Icon iconName="plus" /> Add Project
              </button>
            </div>
          </div>

          <div className="container-fluid">
            <Panel>
              <ProjectsTable
                isFetching={projects.isFetching}
                projects={items}
              />
            </Panel>
          </div>

          <AddProjectDialog
            projects={projects}
            grantedProviders={this.state.grantedProviders}
            handleCreateProjectClick={this.handleCreateProjectClick}
            handleDismissModalClick={this.handleDismissModalClick}
            handleInputChange={this.handleInputChange}
          />
        </div>
      </Layout>
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