import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { createToast } from '../../state/alert/alertActions';
import ProjectService from '../../services/Project';
import ProjectEnvironmentResetService from '../../services/ProjectEnvironmentReset';
import Alert from '../../components/Alert';
import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import Panel from '../../components/Panel';
import PanelBody from '../../components/PanelBody';
import Layout from "../../components/Layout";
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';
import Container from '../../components/Container';

class ProjectEnvironmentResetPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      project: {},
      key: '',
      errors: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
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
    const { dispatch } = this.props;
    const { project, key } = this.state;
    const projectEnvironmentResetService = new ProjectEnvironmentResetService;

    projectEnvironmentResetService
      .update(project.id, {key: key})
      .then(response => {
        dispatch(createToast('Environment key updated successfully.'));

        this.setState({errors: []});
      },
      error => {
        let errorResponse = error.response.data;

        errorResponse = errorResponse.hasOwnProperty('errors') ? errorResponse.errors : errorResponse;

        const errors = Object.keys(errorResponse).reduce(function(previous, key) {
          return previous.concat(errorResponse[key][0]);
        }, []);

        this.setState({errors: errors});
      });
  }

  render() {
    const {
      project,
      key,
      errors
    } = this.state;

    return (
      <Layout project={project}>
        <ProjectHeading project={ project } />

        <div className="content">
          <Container fluid>
            <Alert type="warning">
              Resetting your environment key will also clear the environment contents.
            </Alert>

            <Panel>
              <PanelBody>
                {errors.length ? <AlertErrorValidation errors={errors} /> : ''}

                <div className="form-group">
                  <TextField
                    label="New Key"
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
                  to={'/projects/' + project.id + '/environment-unlock'}
                >Update Environment</Link>
              </PanelBody>
            </Panel>
          </Container>
        </div>
      </Layout>
    )
  }
}

export default connect()(ProjectEnvironmentResetPage);
