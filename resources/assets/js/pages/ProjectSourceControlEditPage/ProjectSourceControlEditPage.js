import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';

import { fetchAccountProviders } from '../../state/accountProviders/actions';
import {fetchProject, updateProject} from "../../state/project/actions";
import AccountProviderService from '../../services/AccountProvider';

import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';
import PanelBody from '../../components/PanelBody';
import TextField from '../../components/TextField';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';
import Grid from '../../components/Grid';

class ProjectSourceControlEditPage extends React.Component {
  state = {
    edit: {
      name: '',
      branch: '',
      repository: '',
      provider_id: 0,
    },
  };

  componentDidMount() {
    const {
      dispatch,
      project,
      match: {
        params: {
          project_id,
        }
      }
    } = this.props;

    if (project.item.id === null) {
      dispatch(fetchProject(project_id));
    }

    dispatch(fetchAccountProviders());

    this.setState({
      edit: this.setEditState(project),
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { project } = this.props;

    if (project.item.id === null) {
      this.setState({
        edit: this.setEditState(nextProps.project),
      });
    }
  }

  /**
   * Sets the necessary project edit state.
   *
   * @param {object} project
   * @return {object}
   */
  setEditState = (project) => {
    return {
      name: project.item.name,
      branch: project.item.branch,
      repository: project.item.repository,
      provider_id: project.item.provider_id,
    };
  };

  /**
   * Handle project's source control input change.
   *
   * @param {object} event
   * @return {void}
   */
  handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    this.setState(state => {
      const project = {
        ...state.edit,
        [name]: value
      };

      return { edit: project }
    });
  };

  /**
   * Handle project's source control update.
   *
   * @param {object} event
   * @return {void}
   */
  handleClick = (event) => {
    const { dispatch, project } = this.props;
    const { edit } = this.state;

    dispatch(updateProject(project.item.id, edit));
  };

  render() {
    const { project, accountProviders } = this.props;

    return (
      <Layout project={ project.item }>
        <ProjectHeading project={ project.item } />

        <div className="content">
          <Container fluid>
            <div className="row">
              <Grid xs={ 12 } sm={ 3 }>
                <Panel>
                  <PanelHeading>
                    <PanelTitle>Project settings</PanelTitle>
                  </PanelHeading>

                  <div className="list-group">
                    <NavLink
                      to={ '/projects/' + project.item.id + '/settings' }
                      className="list-group-item"
                      activeClassName="active"
                      exact
                    >General settings</NavLink>
                    <NavLink
                      to={ '/projects/' + project.item.id + '/settings/source-control' }
                      className="list-group-item"
                      activeClassName="active"
                      exact
                    >Source control</NavLink>
                  </div>
                </Panel>
              </Grid>

              <Grid xs={ 12 } sm={ 9 }>
                <Panel>
                  <PanelHeading>
                    <PanelTitle>Source Control</PanelTitle>
                  </PanelHeading>
                  <PanelBody>
                    { project.errors.length ? <AlertErrorValidation errors={ project.errors } /> : '' }

                    <div className="form-group">
                      <label>Providers</label>

                      {(accountProviders.items || []).map((grantedProvider) =>
                        <div key={ grantedProvider.id }>
                          <label htmlFor={ grantedProvider.name }>
                            <input
                              name="provider_id"
                              type="radio"
                              value={ grantedProvider.id }
                              id={ grantedProvider.name }
                              onChange={ this.handleInputChange }
                              checked={ parseInt(this.state.edit.provider_id) === grantedProvider.id }
                            /> { grantedProvider.name }
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <TextField
                        id="repository"
                        label="Repository"
                        onChange={ this.handleInputChange }
                        name="repository"
                        value={ this.state.edit.repository }
                        placeholder="user/repository"
                      />
                    </div>

                    <div className="form-group">
                      <TextField
                        id="branch"
                        label="Branch"
                        onChange={ this.handleInputChange }
                        name="branch"
                        value={ this.state.edit.branch }
                      />
                    </div>

                    <Button
                      color="primary"
                      onClick={ this.handleClick }
                    >{ project.isUpdating ? 'Saving...' : 'Save' }</Button>
                  </PanelBody>
                </Panel>
              </Grid>
            </div>
          </Container>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    project: state.project,
    accountProviders: state.accountProviders,
  };
};

export default connect(mapStateToProps)(ProjectSourceControlEditPage);
