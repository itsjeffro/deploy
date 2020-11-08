import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { createToast } from '../../state/alert/alertActions';
import ProjectFolderService from '../../services/ProjectFolder';

import Icon from '../../components/Icon';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';
import FoldersTable from './components/FoldersTable';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import {fetchProject} from "../../state/project/actions";
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';
import RemoveLinkedFolderModal from './components/RemoveLinkedFolderModal';
import ProjectModelInterface from '../../interfaces/model/ProjectModelInterface';

class ProjectLinkedFolderPage extends React.Component<any, any> {
  state = {
    isRemoveLinkedFolderModalVisible: false,
    isFetching: true,
    folders: [],
    folder: {
      id: null,
    },
    projectId: null,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: {
          project_id,
        }
      }
    } = this.props;

    this.setState({ projectId: project_id });

    const projectFolderService = new ProjectFolderService;

    dispatch(fetchProject(project_id));

    projectFolderService
      .list(project_id)
      .then((response) => {
        this.setState({
          folders: response.data,
          isFetching: false
        });
      });
  }

  /**
   * Handles showing the modal to prompt the user to remove the target folder.
   */
  modalLinkedFolderRemoveShow = (folder): void => {
    this.setState({
      folder: folder,
      isRemoveLinkedFolderModalVisible: true,
    });
  };

  /**
   * Handles removing the target folder.
   */
  handleLinkedFolderRemoveClick = (): void => {
    const { folder } = this.state;
    const { project, dispatch } = this.props;
    const projectFolderService = new ProjectFolderService;

    projectFolderService
      .delete(project.item.id, folder.id)
      .then((response) => {
        dispatch(createToast('Folder removed successfully.'));

        this.removeFolder(folder.id);

        this.setState({ isRemoveLinkedFolderModalVisible: false });
      },
      (error) => {
        alert('Could not delete linked folder');
      });
  };

  /**
   * Filter out specified folder from state.
   */
  removeFolder = (folder_id: number) => {
    this.setState((state) => {
      const folders = state.folders.filter((folder) => {
        return folder.id !== folder_id;
      });
      return {folders: folders}
    });
  };

  /**
   * Handle hiding the modal repsonsibe for prompting the user to remove the target folder.
   */
  handleHideRemoveLinkedFolderModal = (): void => {
    this.setState({ isRemoveLinkedFolderModalVisible: false });
  }

  render() {
    const { project } = this.props;
    const { folders, isFetching, isRemoveLinkedFolderModalVisible, projectId } = this.state;

    return (
      <Layout project={ project.item }>
        <ProjectHeading project={ project.item } />

        <div className="content">
          <Container fluid>
            <Panel>
              <PanelHeading>
                <div className="pull-right">
                  <Link
                    className="btn btn-default"
                    to={ `/projects/${ projectId }/folders/create` }
                  ><Icon iconName="plus" /> Add Linked Folder</Link>
                </div>
                <PanelTitle>Linked Folders</PanelTitle>
              </PanelHeading>
              <FoldersTable
                isLoading={ isFetching }
                folders={ folders }
                modalLinkedFolderRemoveShow={ this.modalLinkedFolderRemoveShow }
              />
            </Panel>
          </Container>

          <RemoveLinkedFolderModal
            isVisible={ isRemoveLinkedFolderModalVisible }
            onModalHide={ this.handleHideRemoveLinkedFolderModal }
            onRemoveLinkedFolderClick={ this.handleLinkedFolderRemoveClick }
          />
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
)(ProjectLinkedFolderPage);
