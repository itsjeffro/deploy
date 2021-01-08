import * as React from 'react';

import Modal from '../../../components/Modal';

const RemoveHookModal = (props) => {
  const {
    isVisible,
    hook,
    onRemoveHookClick,
    onDismissModalClick,
  } = props;

  return (
    <Modal
      isVisible={ isVisible }
      title="Remove Deployment Hook"
      buttons={[
        {
          text: 'Cancel',
          onPress: () => onDismissModalClick(),
        },
        {
          text: 'Remove',
          onPress: () => onRemoveHookClick(),
        },
      ]}
    >
      Are you sure you want to remove "{ hook.name }"?
    </Modal>
  )
}

export default RemoveHookModal;
