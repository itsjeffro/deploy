import * as React from 'react';
import { connect } from 'react-redux';

import { fetchProject } from '../../state/project/actions';
import ProjectDeploymentService from '../../services/ProjectDeployment';
import { buildSequencesFromProcesses } from '../../utils/squence';

import Container from '../../components/Container';
import Layout from "../../components/Layout";
import Loader from '../../components/Loader';
import OutputModal from './components/OutputModal';
import Panel from '../../components/Panel';
import ProcessTable from './components/ProcessTable';
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';

class ProjectDeploymentPage extends React.Component<any, any> {
  state = {
    isFetching: true,
    processOutput: '',
    deployment: {
        processes: []
    },
    isOutputModalVisible: false,
  };

  /**
   * @returns {void}
   */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: {
          project_id,
          deployment_id
        }
      }
    } = this.props;

    dispatch(fetchProject(project_id));

    const projectDeploymentService = new ProjectDeploymentService();

    projectDeploymentService
      .get(project_id, deployment_id)
      .then(response => {
        this.setState({
          isFetching: false,
          deployment: response.data
        });
      });
  }

  /**
   * @param {object} process
   * @returns {void}
   */
  handleProcessOutputClick = (process) => {
    this.setState({
      processOutput: process.output,
      isOutputModalVisible: true,
    });
  };

  /**
   * @returns {void}
   */
  handleHideOutputModal = () => {
    this.setState({
      isOutputModalVisible: false,
    })
  }

  render() {
    const { 
      isFetching,
      deployment,
      processOutput,
      isOutputModalVisible,
    } = this.state;
  
    const { project } = this.props;

    const sequences = buildSequencesFromProcesses(deployment.processes);

    const sequenceList = sequences.map((sequence) => (
      <Panel key={ sequence.id }>
        <div className="panel-heading">
          <h3 className="panel-title">{ sequence.name }</h3>
        </div>
        <div className="table-responsive">
          <ProcessTable
            sequence={ sequence }
            onProcessOutputClick={ this.handleProcessOutputClick }
          />
        </div>
      </Panel>
    ));

    return (
      <Layout project={ project.item }>
        <ProjectHeading project={ project.item } />

        <div className="content">
          <Container fluid>
            { isFetching ? <Loader /> : sequenceList }
          </Container>

          <OutputModal
            isVisible={ isOutputModalVisible }
            onModalHide={ this.handleHideOutputModal }
            processOutput={ processOutput }
          />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    project: state.project,
  };
};

export default connect(mapStateToProps)(ProjectDeploymentPage);
