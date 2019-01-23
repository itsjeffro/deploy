import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Icon from '../../components/Icon';
import Loader from '../../components/Loader';
import Panel from '../../components/Panel';
import Modal from '../../components/Modal';

import ProcessTable from './ProcessTable';

import ProjectDeploymentService from '../../services/ProjectDeployment';

import { buildSequencesFromProcesses } from '../../utils/squence';

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
    const { 
      project_id,
      deployment_id 
    } = this.props.match.params;
    
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
      <div>
        <div className="breadcrumbs">
          <div className="container">
            <span className="heading">
              <Link to={'/projects/' + project.id}>
                {project.name}
              </Link>{' '}
              <Icon iconName="angle-double-right" /> Deployment Info
            </span>
          </div>
        </div>

        <div className="container content">
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
    );
  }
}

const mapStateToProps = state => {
  return state.project;
};

export default connect(
  mapStateToProps
)(ProjectDeploymentPage);