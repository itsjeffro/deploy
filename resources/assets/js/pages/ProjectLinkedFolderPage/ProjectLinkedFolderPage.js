import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ProjectFolderService from '../../services/ProjectFolder';

import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';

class ProjectLinkedFolderPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isFetching: true,
      folders: [],
      folder: {}
    };
    
    this.modalLinkedFolderRemoveShow = this.modalLinkedFolderRemoveShow.bind(this);
    this.handleLinkedFolderRemoveClick = this.handleLinkedFolderRemoveClick.bind(this);
  }
  
  componentWillMount() {
    const { project } = this.props;
    const projectFolderService = new ProjectFolderService;

    projectFolderService
      .list(project.id)
      .then(response => {
        this.setState({
          folders: response.data,
          isFetching: false
        });
      });
  }
  
  modalLinkedFolderRemoveShow(folder) {
    this.setState({folder: folder});

    $('#linked-folder-remove-modal').modal('show');
  }

  handleLinkedFolderRemoveClick() {
    const { folder } = this.state;
    const { project } = this.props;
    const projectFolderService = new ProjectFolderService;

    projectFolderService
      .delete(project.id, folder.id)
      .then(response => {
        alert('Linked folder was removed from project');

        $('#linked-folder-remove-modal').modal('hide');
      },
      error => {
        alert('Could not delete linked folder');
      });
  }
  
  renderFoldersTable(folders) {
    return (
      <Panel>
        <PanelHeading>
          Linked Folders
        </PanelHeading>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {folders.map(folder =>
                <tr>
                  <td>{folder.from}</td>
                  <td>{folder.to}</td>
                  <td className="text-right">
                    <Button
                      color="default"
                      onClick={() => this.modalLinkedFolderRemoveShow(folder)}
                    ><Icon iconName="times" /></Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    )
  }

  render() {
    const { project } = this.props;
    const { folders, isFetching } = this.state;

    return (
      <div>
        <div className="breadcrumbs">
          <div className="container">
            <div className="pull-left">
              <span className="heading">
                <Link to={'/projects/' + project.id}>{project.name}</Link> <Icon iconName="angle-double-right" /> Linked Folders
              </span>
            </div>
          </div>
        </div>
        
        <div className="container content">
          <div className="form-group pull-right">
            <Link
                className="btn btn-default"
                to={'/projects/' + project.id + '/folders/create'}
              ><Icon iconName="plus" /> Add Linked Folder</Link>
          </div>
          
          <div className="clearfix"></div>
          
          {isFetching ? <Loader /> : this.renderFoldersTable(folders)}
        </div>
        
        <Modal
          id="linked-folder-remove-modal"
          title="Remove Linked Folder"
          buttons={[
            {text: 'Cancel', onPress: () => $('#linked-folder-remove-modal').modal('hide')},
            {text: 'Remove Linked Folder', onPress: () => this.handleLinkedFolderRemoveClick()}
          ]}
        >
          Are you sure you want to remove this link folder from the project?
          <br/>
          Note: Your folder will not be removed from the server. This will
          only prevent a symlink during your next deploy.
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state.project;
};

export default connect(
  mapStateToProps
)(ProjectLinkedFolderPage);