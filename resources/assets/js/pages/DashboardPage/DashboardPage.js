import React from 'react';
import { connect } from 'react-redux';

import { createProject, fetchProjects } from '../../state/projects/actions';
import { fetchAccountProviders } from '../../state/accountProviders/actions';

import AddProjectModal from './components/AddProjectModal';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import ProjectsTable from './components/ProjectsTable';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import Warnings from './components/Warnings';

class DashboardPage extends React.Component {
  state = {
    input: {},
    isAddProjectModalVisible: false,
  };

  /**
   * Fetch data for projects and providers.
   */
  componentDidMount() {
    const { dispatch, projects } = this.props;

    if (typeof projects.items === 'object' && projects.items.length === 0) {
      dispatch(fetchProjects());
    }
    
    dispatch(fetchAccountProviders());
  }

  /**
   * Handle input change from the project add form.
   *
   * @param {object} event
   */
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let input = Object.assign({}, this.state.input);
    input[name] = value;

    this.setState({input: input});
  };

  /**
   * Handles creating the project once the form button is clicked.
   */
  handleCreateProjectClick = () => {
    const { dispatch } = this.props;

    dispatch(createProject(this.state.input));
  };

  /**
   * Handle click for displaying the create project modal.
   */
  handleShowModalClick = () => {
    this.setState({ isAddProjectModalVisible: true });
  };

  /**
   * Handle click for dismissing the create project modal.
   */
  handleDismissModalClick = () => {
    this.setState({ isAddProjectModalVisible: false });
  };

  /**
   * Return list of warnings.
   *
   * @returns {array}
   */
  warnings = () => {
    return window.Deploy.warnings || [];
  }

  /**
   * Render page.
   */
  render() {
    const { isAddProjectModalVisible } = this.state;
    const { projects, accountProviders } = this.props;

    const items = Object.keys(projects.items).map(key => {
      return projects.items[key];
    });

    return (
      <Layout>
        <div className="content">
          <Container fluid>
            <div className="pull-left heading">
              <h2>Project List</h2>
            </div>
            <div className="pull-right">
              <Button color="primary" onClick={ this.handleShowModalClick }>
                <Icon iconName="plus" /> Add Project
              </Button>
            </div>
          </Container>

          <Warnings warnings={ this.warnings() } />

          <Container fluid>
            <Panel>
              <ProjectsTable
                isFetching={ projects.isFetching }
                projects={ items }
              />
            </Panel>
          </Container>

          <AddProjectModal
            isVisible={ isAddProjectModalVisible }
            projects={ projects }
            grantedProviders={ accountProviders.items }
            handleCreateProjectClick={ this.handleCreateProjectClick }
            handleDismissModalClick={ this.handleDismissModalClick }
            handleInputChange={ this.handleInputChange }
          />
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects,
    accountProviders: state.accountProviders,
  };
};

export default connect(mapStateToProps)(DashboardPage);
