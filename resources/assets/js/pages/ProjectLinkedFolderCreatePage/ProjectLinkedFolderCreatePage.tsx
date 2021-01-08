import * as React from 'react';
import { connect } from 'react-redux';
import {Link, Redirect} from 'react-router-dom';

import { createToast } from '../../state/alert/alertActions';
import ProjectFolderService from '../../services/ProjectFolder';
import Alert from '../../components/Alert';
import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import PanelBody from '../../components/PanelBody';
import Layout from "../../components/Layout";
import { fetchProject } from "../../state/project/actions";
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';

class ProjectLinkedFolderCreatePage extends React.Component<any, any> {
  state = {
    isFetching: true,
    isCreated: false,
    folder: {
      from: '',
      to: '',
    },
    errors: [],
  };

  componentDidMount() {
    const {
      dispatch,
      project,
      match: {
        params: {
          project_id
        }
      }
    } = this.props;

    dispatch(fetchProject(project_id));
  }

  /**
   * Handle input change for a new linked folder.
   *
   * @param {object} event
   */
  handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(state => {
      const folder = Object.assign({}, state.folder, {
        [name]: value
      });

      return {folder: folder}
    });
  };

  /**
   * Handle click for saving a new folder.
   *
   * @param {object} event
   */
  handleClick = (event) => {
    const { dispatch, project } = this.props;
    const { folder } = this.state;
    const projectFolderService = new ProjectFolderService;

    projectFolderService
      .create(project.item.id, folder)
      .then(response => {
        dispatch(createToast('Folder created successfully.'));

        this.setState({
          isCreated: true,
          errors: []
        });
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
    const { project } = this.props;
    const { isCreated, errors } = this.state;

    if (isCreated) {
      return <Redirect to={'/projects/' + project.item.id + '/folders'} />
    }

    return (
      <Layout project={project.item}>
        <ProjectHeading project={ project.item } />

        <div className="content">
          <div className="container-fluid heading">
            <Link to={'/projects/' + project.item.id + '/folders'}>Back to Linked Folders</Link>
          </div>

          <div className="container-fluid">
            <Alert type="warning">
              This linked folder will be created on your server during the next deployment.
            </Alert>

            <Panel>
              <PanelBody>
                {errors.length ? <AlertErrorValidation errors={errors} /> : ''}

                <div className="form-group">
                  <label htmlFor="from">Link Name</label>
                  <input
                    className="form-control"
                    name="from"
                    type="text"
                    id="from"
                    onChange={this.handleInputChange}
                    value={this.state.folder.from}
                    placeholder="uploads"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="to">To Target</label>
                  <input
                    className="form-control"
                    name="to"
                    type="text"
                    id="project_path"
                    onChange={this.handleInputChange}
                    value={this.state.folder.to}
                    placeholder="storage/uploads"
                  />
                </div>

                <Button color="primary"
                  onClick={this.handleClick}
                >Save Linked Folder</Button>
              </PanelBody>
            </Panel>
          </div>
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
)(ProjectLinkedFolderCreatePage);
