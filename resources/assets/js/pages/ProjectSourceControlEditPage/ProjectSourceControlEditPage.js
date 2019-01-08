import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Deploy } from '../../config';

import ProjectService from '../../services/Project';
import AccountProviderService from '../../services/AccountProvider';

import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelBody from '../../components/PanelBody';
import TextField from '../../components/TextField';

class ProjectSourceControlEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      project: {},
      grantedProviders: [],
      errors: {},
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const { project } = this.props;
    const accountProviderService = new AccountProviderService;

    this.setState({project: project});

    accountProviderService
      .index('/api/account-providers')
      .then(response => {
        this.setState({
          grantedProviders: response.data
        });
      });
  }

  handleInputChange(event) {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    this.setState(state => {
      const project = Object.assign({}, state.project, {
        [name]: value
      });
      return {project: project}
    });
  }

  handleClick(event) {
    const { project } = this.state;
    const projectService = new ProjectService;

    projectService
      .update(project.id, project)
      .then(response => {
        alert('Project was updated');
      },
      error => {
        alert('Project could not be updated');
      });
  }

  render() {
    const {
      project,
      errors,
      grantedProviders
    } = this.state;

    return (
      <div>
        <div className="breadcrumbs">
          <div className="container">
            <span className="heading">
              <Link to={Deploy.path + '/projects/' + project.id}>{project.name}</Link> <Icon iconName="angle-double-right" /> Source Control
            </span>
          </div>
        </div>

        <div className="container content">
          <div className="row">
            <div className="col-xs-12 col-sm-3">
              <Panel>
                <PanelHeading>
                  <h3 className="panel-title">Project settings</h3>
                </PanelHeading>

                <div className="list-group">
                  <Link to={Deploy.path + '/projects/' + project.id + '/edit'} className="list-group-item">General settings</Link>
                  <Link to={Deploy.path + '/projects/' + project.id + '/source-control/edit'} className="list-group-item">Source control</Link>
                </div>
              </Panel>
            </div>

            <div className="col-xs-12 col-sm-9">
              <Panel>
                <PanelBody>
                  <div className={'form-group' + (errors.hasOwnProperty('provider_id') ? ' has-error' : '')}>
                    <label>Providers</label>
                    {errors.hasOwnProperty('provider_id') ?  <span className="help-block"><strong>{errors.provider_id[0]}</strong></span> : ''}

                    {grantedProviders.map(grantedProvider =>
                      <div key={grantedProvider.provider.id}>
                        <label htmlFor={grantedProvider.provider.name}>
                          <input name="provider_id"
                            type="radio"
                            value={grantedProvider.provider.id}
                            id={grantedProvider.provider.name}
                            onChange={this.handleInputChange}
                            checked={project.provider_id == grantedProvider.provider.id}
                          /> {grantedProvider.provider.name}
                        </label>
                      </div>
                    )}
                  </div>

                  <div className={'form-group' + (errors.repository ? ' has-error' : '')}>
                    <TextField
                      id="repository"
                      label="Respository"
                      onChange={this.handleInputChange}
                      name="repository"
                      value={project.repository}
                    />
                    {errors.repository ? <span className="help-block"><strong>{errors.repository[0]}</strong></span> : ''}
                  </div>

                  <Button
                    color="primary"
                    onClick={this.handleClick}
                  >Save</Button>
                </PanelBody>
              </Panel>
            </div>
          </div>
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
)(ProjectSourceControlEditPage);