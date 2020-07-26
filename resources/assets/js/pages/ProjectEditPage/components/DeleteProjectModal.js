import React from 'react';
import Modal from '../../../components/Modal';

const DeleteProjectModal = (props) => {
  const {
    isVisible,
    onModalHide,
    onDeleteProjectClick,
  } = props;

  return (
    <Modal
      isVisible={ isVisible }
      title="Delete Project"
      buttons={[
        {
          text: 'Cancel',
          onPress: () => onModalHide(),
        },
        {
          text: 'Delete project',
          onPress: () => onDeleteProjectClick(),
        }
      ]}
    >
      Are you sure you want to delete this project?
    </Modal>
  )
}

export default DeleteProjectModal;
