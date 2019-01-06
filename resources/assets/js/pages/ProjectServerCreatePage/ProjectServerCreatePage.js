import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import ProjectService from '../../services/Project';
import ProjectServerService from '../../services/ProjectServer';

import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Panel from '../../components/Panel';

class ProjectServerCreatePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetching: true,
            isCreated: false,
            project: {}, 
            server: {},
        };
        
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
            const server = Object.assign({}, state.server, {
                [name]: value
            });
            return {server: server}
        });
    }
    
    handleClick(event) {
        const { project, server } = this.state;
        const projectServerService = new ProjectServerService;
        
        projectServerService
            .create(project.id, server)
            .then(response => {
                this.setState({isCreated: true});
            },
            error => {
                alert('Could not create server');
            });
    }

    render() {
        const { 
            project, 
            server,
            isCreated
        } = this.state;
        
        if (isCreated) {
            return <Redirect to={'/projects/' + project.id} />
        }

        return (
            <div>
                <div className="breadcrumbs">
                    <div className="container">
                        <div className="pull-left">
                            <span className="heading">
                                <Link to={'/projects/' + project.id}>{project.name}</Link> <Icon iconName="angle-double-right" /> Add Server
                            </span>
                        </div>
                    </div>
                </div>

                <div className="container content">
                    <Panel>
                        <div className="panel-body">
                            <h4>Server details</h4>

                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input 
                                    className="form-control" 
                                    name="name" 
                                    type="text" 
                                    id="name"
                                    onChange={this.handleInputChange}
                                    value={server.name}
                                />
                            </div>
                            <div className="row">
                                <div className="form-group col-xs-8 col-md-9">
                                    <label htmlFor="ip_address">Ip Address</label>
                                    <input 
                                        className="form-control" 
                                        name="ip_address"
                                        type="text"
                                        id="ip_address"
                                        onChange={this.handleInputChange}
                                        value={server.ip_address}
                                    />
                                </div>
                                <div className="form-group col-xs-4 col-md-3">
                                    <label htmlFor="port">Port</label>
                                    <input
                                        className="form-control"
                                        name="port"
                                        type="text"
                                        id="port"
                                        onChange={this.handleInputChange}
                                        value={server.port}
                                        placeholder="22"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="connect_as">Connect As</label>
                                <input
                                    className="form-control"
                                    name="connect_as"
                                    type="text"
                                    id="connect_as"
                                    onChange={this.handleInputChange}
                                    value={server.connect_as}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="project_path">Project Path</label>
                                <input
                                    className="form-control"
                                    name="project_path"
                                    type="text"
                                    id="project_path"
                                    onChange={this.handleInputChange}
                                    value={server.project_path}
                                />
                            </div>

                            <Button color="primary" onClick={this.handleClick}>Save Server</Button>
                        </div>
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
)(ProjectServerCreatePage);