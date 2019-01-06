import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import ProjectService from '../../services/Project';
import ProjectFolderService from '../../services/ProjectFolder';

import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Panel from '../../components/Panel';
import PanelBody from '../../components/PanelBody';

class ProjectLinkedFolderCreatePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetching: true,
            isCreated: false,
            project: {},
            folder: {},
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
        const { project, folder } = this.state;
        const projectFolderService = new ProjectFolderService;

        projectFolderService
            .create(project.id, folder)
            .then(response => {
                this.setState({isCreated: true});
            },
            error => {
                alert('Could not create linked folder');
            });
    }

    render() {
        const { project } = this.props;
        const { isCreated,folder } = this.state;
        
        if (isCreated) {
            return <Redirect to={'/projects/' + project.id + '/folders'} />
        }

        return (
            <div>
                <div className="breadcrumbs">
                    <div className="container">
                        <div className="pull-left">
                            <span className="heading">
                                <Link to={'/projects/' + project.id}>{project.name}</Link> <Icon iconName="angle-double-right" /> Add Linked Folder
                            </span>
                        </div>
                    </div>
                </div>

                <div className="container content">
                    <Alert type="warning">
                        This linked folder will be created on your server during the next deployment.
                    </Alert>
                        
                    <Panel>
                        <PanelBody>
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
        )
    }
}

const mapStateToProps = state => {
    return state.project;
};

export default connect(
    mapStateToProps
)(ProjectLinkedFolderCreatePage);