import React from 'react';
import { connect } from 'react-redux';

import { fetchProject } from '../../state/project/projectActions';
import ProjectDeploymentService from '../../services/ProjectDeployment';
import { buildSequencesFromProcesses } from '../../utils/squence';

import Loader from '../../components/Loader';
import Panel from '../../components/Panel';
import Modal from '../../components/Modal';
import ProcessTable from './ProcessTable';
import Layout from "../../components/Layout";

class ProjectDeploymentPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      processOutput: '',
      deployment: {
          processes: []
      }
    };

    this.handleProcessOutputClick = this.handleProcessOutputClick.bind(this);
  }

  componentWillMount() {
    const {project_id, deployment_id} = this.props.match.params;
    const {dispatch, project} = this.props;

    if (typeof project === 'object' && Object.keys(project).length === 0) {
        dispatch(fetchProject(project_id));
    }

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
   * Show process output modal.
   *
   * @param {object} process
   */
  handleProcessOutputClick(process) {
    this.setState({
      processOutput: process.output
    });

    $('#process-output-modal').modal('show');
  }

  render() {
    const { isFetching, deployment, processOutput } = this.state;
    const { project } = this.props;

    const sequences = buildSequencesFromProcesses(deployment.processes);

    const sequenceList = sequences.map(sequence => (
      <Panel key={sequence.id}>
        <div className="panel-heading">
          <h3 className="panel-title">{sequence.name}</h3>
        </div>
        <div className="table-responsive">
          <ProcessTable
            sequence={sequence}
            onProcessOutputClick={this.handleProcessOutputClick}
          />
        </div>
      </Panel>
    ));

    return (
      <Layout project={project}>
        <div className="content">
          <div className="container-fluid heading">
            <h2>Deployment Info</h2>
          </div>

          <div className="container-fluid">
            {isFetching ? <Loader /> : sequenceList}
          </div>

          <Modal
            id="process-output-modal"
            title="Process Output"
            buttons={[
              { text: 'Close', onPress: () => $('#process-output-modal').modal('hide') }
            ]}
          >
            <div
              className="well"
              style={{
                marginBottom: 0,
                whiteSpace: 'pre-line',
                overflowX: 'auto'
              }}
            >
              {processOutput}
            </div>
          </Modal>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return state.project;
};

export default connect(
  mapStateToProps
)(ProjectDeploymentPage);
