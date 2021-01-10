import * as React from 'react';
import Modal from '../../../components/Modal';

export interface PropsInterface {
  isVisible: boolean
  isDeleting: boolean
  onModalHide: Function
  onRemoveServerClick: Function
}

const RemoveServerModal = (props: PropsInterface) => {
  const {
    isVisible,
    isDeleting,
    onModalHide,
    onRemoveServerClick,
  } = props;

  return (
    <Modal
      isVisible={ isVisible }
      id="server-remove-modal"
      title="Remove Server"
      buttons={[
        {
          text: 'Cancel',
          onPress: () => onModalHide()
        },
        {
          text: isDeleting ? 'Working...' : 'Remove Server',
          onPress: () => onRemoveServerClick()
        }
      ]}
    >
      Only servers with no projects can be deleted. Are you sure you want to delete this server?
    </Modal>
  );
};

export default RemoveServerModal;
