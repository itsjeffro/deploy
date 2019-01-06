import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Loader from '../../components/Loader';
import Panel from '../../components/Panel';
import Modal from '../../components/Modal';

import ProjectDeploymentService from '../../services/ProjectDeployment';

class ProjectDeploymentPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      deployment: {
          processes: []
      },
      processOutput: ''
    };

    this.handleProcessOutputClick = this.handleProcessOutputClick.bind(this);
  }

  componentWillMount() {
    const projectDeploymentService = new ProjectDeploymentService();
    const { project_id, deployment_id } = this.props.match.params;

    projectDeploymentService.get(project_id, deployment_id).then(response => {
      this.setState({
        isFetching: false,
        deployment: response.data
      });
    });
  }

  handleProcessOutputClick(process) {
    this.setState({ processOutput: process.output });

    $('#process-output-modal').modal('show');
  }

  processStatusIcon(process) {
    if (process.status === 1) {
      return (
        <span>
          <Icon iconName="check" /> Finished
        </span>
      );
    }

    if (process.status === 2) {
      return (
        <span>
          <Icon iconName="times" /> Finished With Errors
        </span>
      );
    }

    if (process.status === 3) {
      return (
        <span>
          <Icon iconName="spinner fa-spin" /> Running
        </span>
      );
    }

    if (process.status === 4) {
      return (
        <span>
          <Icon iconName="times" /> Cancelled
        </span>
      );
    }

    return (
      <span>
        <Icon iconName="spinner fa-spin" /> Waiting
      </span>
    );
  }

  processStatusColor(process) {
    if (process.status === 1) {
      return 'table-success';
    }

    if (process.status === 2 || process.status === 4) {
      return 'table-danger';
    }

    return '';
  }

  processDuration(process) {
    let startDate = new Date(process.started_at);
    let finishDate = new Date(process.finished_at);

    return (finishDate.getTime() - startDate.getTime()) / 1000;
  }

  render() {
    const { isFetching, deployment, processOutput } = this.state;
    const { project } = this.props;

    const sequences = deployment.processes.reduce((sequences, process) => {
      if (sequences[process.sequence] === undefined) {
        sequences[process.sequence] = {
          id: process.sequence,
          name: process.name,
          processes: []
        };
      }

      sequences[process.sequence].processes.push(process);

      return sequences;
    }, []);

    const sequenceList = sequences.map(sequence => (
      <Panel key={sequence.id}>
        <div className="panel-heading">
          <h3 className="panel-title">{sequence.name}</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th width="15%">Server</th>
                <th width="20%">Status</th>
                <th>Started At</th>
                <th>Finished At</th>
                <th>Duration</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {sequence.processes.map(process => (
                <tr
                  key={process.id}
                  className={this.processStatusColor(process)}
                >
                  <td width="15%">{process.server_name}</td>
                  <td width="20%">{this.processStatusIcon(process)}</td>
                  <td>{process.started_at ? process.started_at : 'N/A'}</td>
                  <td>{process.finished_at ? process.finished_at : 'N/A'}</td>
                  <td>
                    {process.finished_at ? this.processDuration(process) + ' Seconds' : 'N/A'}
                  </td>
                  <td className="text-right">
                    {process.status !== 4 ? (
                      <Button
                        onClick={() => this.handleProcessOutputClick(process)}
                      >
                        <Icon iconName="files-o" /> Output
                      </Button>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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