import React from 'react';
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

class ProjectLinkedFolderCreatePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetching: true,
            isCreated: false,
            project: {},
            folder: {},
            errors: []
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        const { project } = this.props;

        this.setState({project: project});
    }

    handleInputChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(state => {
            const folder = Object.assign({}, state.folder, {
                [name]: value
            });

            return {folder: folder}
        });
    }

    handleClick(event) {
        const { dispatch } = this.props;
        const { project, folder } = this.state;
        const projectFolderService = new ProjectFolderService;

        projectFolderService
            .create(project.id, folder)
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
    const {
      isCreated,
      folder,
      errors
    } = this.state;

    if (isCreated) {
      return <Redirect to={'/projects/' + project.id + '/folders'} />
    }

    return (
      <Layout project={project}>
        <div className="content">
          <div className="container-fluid heading">
            <h2>Add Linked Folder</h2>
            <Link to={'/projects/' + project.id + '/folders'}>Back to Linked Folders</Link>
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
                    value={folder.from}
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
                    value={folder.to}
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
    return state.project;
};

export default connect(
    mapStateToProps
)(ProjectLinkedFolderCreatePage);
