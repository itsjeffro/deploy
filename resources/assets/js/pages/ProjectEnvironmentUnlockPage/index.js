import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Deploy } from '../../config';

import ProjectService from '../../services/Project';
import ProjectEnvironmentUnlockService from '../../services/ProjectEnvironmentUnlock';
import ProjectEnvironmentService from '../../services/ProjectEnvironment';

import Alert from '../../components/Alert';
import AlertErrorValidation from '../../components/AlertErrorValidation'; 
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import TextField from '../../components/TextField';
import Panel from '../../components/Panel';
import PanelBody from '../../components/PanelBody';

class ProjectEnvironmentUnlockPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      project: {},
      environment: {
        key: ''
      },
      unlocked: false,
      errors: []
    }
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleUpdateClick = this.handleUpdateClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
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
  
  componentDidMount() {
    const { project } = this.props;

    Echo.private('project.' + project.id)
      .listen('EnvironmentSyncing', (e) => {
        let environment = e.environment.id;
      })
      .listen('EnvironmentSynced', (e) => {
        let environment = e.environment.id;
      });
  }
  
  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState(state => {
      let environment = Object.assign({}, state.environment, {
        [name]: value
      });
      return {environment: environment}
    });
  }
  
  handleClick() {
    const { project, environment } = this.state;
    const projectEnvironmentUnlockService = new ProjectEnvironmentUnlockService;
    
    projectEnvironmentUnlockService
      .post(project.id, environment)
      .then(response => {
      	this.setState({errors: []});

        this.setState(state => {
          let environment = Object.assign({}, state.environment, response.data);
          return {
            environment: environment,
            unlocked: true
          }
        });
      },
      error => {
        const errorResponse = error.response.data;
      	
      	const errors = Object.keys(errorResponse).reduce(function(previous, key) {
    		  return previous.concat(errorResponse[key][0]);
    		}, []);
      	
        this.setState({errors: errors});
      });
  }
  
  handleUpdateClick() {
    const { project, environment } = this.state;
    const projectEnvironmentService = new ProjectEnvironmentService;

    projectEnvironmentService
      .put(project.id, environment)
      .then(response => {
      	this.setState({errors: []});
      }, 
      error => {
        alert('Could not update');
      });
  }
  
  handleCancelClick() {
    this.setState(state => {
      let environment = Object.assign({}, state.environment, {
        key: null,
        contents: null
      });
      return {
        environment: environment,
        unlocked: false
      }
    });
  }

  renderBreadcrumbs(project) {
    return (
      <div className="breadcrumbs">
        <div className="container">
          <div className="pull-left">
            <span className="heading">
              <Link to={Deploy.path + '/projects/' + project.id}>{project.name}</Link> <Icon iconName="angle-double-right" /> Environment
            </span>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      environment,
      unlocked,
      errors
    } = this.state;
    
    const {
      project
    } = this.props;
    
    if (unlocked) {
      return (
        <div>
          {this.renderBreadcrumbs(project)}

          <div className="container content">
            <Alert type="warning">
              Your environment information will be stored in an .env file on your servers.
            </Alert>
            
            <Panel>
              <PanelBody>
              	{errors.length ? <AlertErrorValidation errors={errors} /> : ''}

              	<div class="form-group">
                  <TextField
                    label="Key"
                    name="key"
                    type="password"
                    onChange={this.handleInputChange}
                    value={environment.key}
                  />
                </div>

                <div class="form-group">
                  <label>Contents</label>
                  <textarea
                    className="form-control"
                    name="contents"
                    onChange={this.handleInputChange}
                    rows="6"
                    style={{fontFamily: 'monospace', resize: 'vertical'}}
                  >{environment.contents}</textarea>
                </div>

                <Button 
                  onClick={this.handleCancelClick}
                  style={{marginRight: 5}}
                >Cancel</Button>

                <Button 
                  onClick={this.handleUpdateClick}
                >Update Environment</Button>
              </PanelBody>
            </Panel>
          </div>
        </div>
      )
    }

    return (
      <div>
        {this.renderBreadcrumbs(project)}

        <div className="container content">
          <Alert type="warning">
            Your environment information will be encrypted on our server using your
            chosen key. You will also have to provide your key each time you wish to
            update your information.
            <br/><br/>
            Please keep in mind that we do not store your key and have no way of
            retrieving it. Therefore if you forget your key, you will need to reset your key which will also
            result in any previous encrypted environment information being cleared
            from our server.
          </Alert>
          
          <Panel>
            <PanelBody>
            	{errors.length ? <AlertErrorValidation errors={errors} /> : ''}

            	<div class="form-group">
                <TextField
                  label="Key"
                  name="key"
                  type="password"
                  onChange={this.handleInputChange}
                  value={environment.key}
                />
              </div>

              <div className="form-group">
                <Button 
                  onClick={this.handleClick}
                >Unlock Environment</Button>
              </div>

              <Link 
                to={Deploy.path + '/projects/' + project.id + '/environment-reset'}
              >Need to reset your key?</Link>
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
)(ProjectEnvironmentUnlockPage)