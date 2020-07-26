import React from 'react';
import Modal from '../../../components/Modal';

const RemoveLinkedFolderModal = (props) => {
  const {
    isVisible,
    onModalHide,
    onRemoveLinkedFolderClick,
  } = props;

  return (
    <Modal
      isVisible={ isVisible }
      title="Remove Linked Folder"
      buttons={[
        {
          text: 'Cancel',
          onPress: () => onModalHide(),
        },
        {
          text: 'Remove linked folder',
          onPress: () => onRemoveLinkedFolderClick(),
        }
      ]}
    >
      Are you sure you want to remove this link folder from the project?
      <br/>
      Note: Your folder will not be removed from the server. This will
      only prevent a symlink during your next deploy.
    </Modal>
  )
}

export default RemoveLinkedFolderModal;
