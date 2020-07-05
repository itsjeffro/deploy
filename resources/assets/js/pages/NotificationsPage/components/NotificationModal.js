import React from 'react';
import Modal from '../../../components/Modal';

const NotificationModal = (props) => {
  const {
    isVisible,
    notification,
    onDismissModalClick,
  } = props;

  return (
    <Modal
      isVisible={ isVisible }
      title={ `Notification #${ notification.id }` }
      buttons={[
        {
          text: 'Cancel', 
          onPress: () => onDismissModalClick()
        }
      ]}
    >
      <div               
        style={{
          marginBottom: 0,
          whiteSpace: 'pre-line',
          overflowX: 'auto'
        }}
      >{ notification.contents }</div>
    </Modal>
  )
};

export default NotificationModal;
