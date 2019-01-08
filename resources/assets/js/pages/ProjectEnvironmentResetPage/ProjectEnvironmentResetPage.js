import React from 'react';
import { Link } from 'react-router-dom';
import { Deploy } from '../../config';

import ProjectService from '../../services/Project';
import ProjectEnvironmentResetService from '../../services/ProjectEnvironmentReset';

import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import TextField from '../../components/TextField';
import Panel from '../../components/Panel';
import PanelBody from '../../components/PanelBody';

export default class ProjectEnvironmentResetPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      project: {},
      key: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const projectService = new ProjectService;

    projectService
      .get(this.props.match.params.project_id)
      .then(response => {
        this.setState({
          isFetching: false,
          project: response.data
        });
      });
  }

  handleInputChange(event) {
    const value = event.target.value;
    this.setState({key: value});
  }

  handleClick() {
    const { project, key } = this.state;
    const projectEnvironmentResetService = new ProjectEnvironmentResetService;

    projectEnvironmentResetService
      .update(project.id, {key: key})
      .then(response => {
        alert('Environment key was successfully reset');
      },
      error => {
        alert('Could not reset environment key')
      });
  }

  render() {
    const { project, key } = this.state;

    return (
      <div>
        <div className="breadcrumbs">
          <div className="container">
            <div className="pull-left">
              <span className="heading">
                <Link to={Deploy.path + '/projects/' + project.id}>{project.name}</Link> <Icon iconName="angle-double-right" /> Reset Environment Key
              </span>
            </div>
          </div>
        </div>

        <div class="container content">
          <Alert type="warning">
            Resetting your environment key will also clear the environment contents.
          </Alert>

          <Panel>
            <PanelBody>
              <div class="form-group">
                <TextField
                  label="Key"
                  name="key"
                  type="password"
                  onChange={this.handleInputChange}
                  value={key}
                />
              </div>
              <div className="form-group">
                <Button
                  onClick={this.handleClick}
                >Reset Environment Key</Button>
              </div>
              <Link
                to={Deploy.path + '/projects/' + project.id + '/environment-unlock'}
              >Update Environment</Link>
            </PanelBody>
          </Panel>
        </div>
      </div>
    )
  }
}