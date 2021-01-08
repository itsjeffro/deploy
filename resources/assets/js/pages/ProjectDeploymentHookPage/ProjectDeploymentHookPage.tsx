import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchProject } from '../../state/project/actions';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';
import ProjectActionService from '../../services/ProjectAction';
import Layout from "../../components/Layout";
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';

class ProjectDeploymentHookPage extends React.Component<any, any> {
  state = {
    isFetching: true,
    actions: []
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: {
          project_id
        }
      }
    } = this.props;

    const projectActionService = new ProjectActionService;

    dispatch(fetchProject(project_id));

    projectActionService
      .index(project_id)
      .then(response => {
        this.setState({
          isFetching: false,
          actions: response.data
        });
      });
  }

  /**
   * Returns hooks and the associated actions (before and after) per action.
   *
   * @param project
   * @param actions
   */
  renderActionsTable = (project, actions) => {
    return (
      <Panel>
        <PanelHeading>
          <PanelTitle>Deployment Hooks</PanelTitle>
        </PanelHeading>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Before</th>
                <th>After</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {actions.map(action =>
                <tr key={action.id}>
                  <td width="40%">
                    {action.name}
                  </td>
                  <td width="20%">
                    {action.before_hooks.map(hook => {
                      return hook.name;
                    }).join(', ')}
                  </td>
                  <td width="20%">
                    {action.after_hooks.map(hook => {
                      return hook.name;
                    }).join(', ')}
                  </td>
                  <td className="text-right">
                    <Link
                      className="btn btn-default"
                      to={'/projects/' + project.id + '/deployment-hooks/actions/' + action.id}
                    >Manage</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    )
  };

  render() {
    const { project } = this.props;
    const { 
      isFetching, 
      actions 
    } = this.state;

    return (
      <Layout project={project.item}>
        <ProjectHeading project={ project.item } />

        <div className="content">
          <Container fluid>
            { isFetching ? <Loader /> : this.renderActionsTable(project.item, actions) }
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
)(ProjectDeploymentHookPage);
