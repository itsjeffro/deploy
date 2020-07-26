import React from 'react';
import Modal from '../../../components/Modal';
import Alert from '../../../components/Alert';

const ServerKeyModal = (props) => {
  const {
    isVisible,
    onModalHide,
    server,
  } = props;

  return (
    <Modal
      isVisible={ isVisible }
      id="server-key-modal"
      title="Server Public Key"
      buttons={[
        { 
          text: 'Close', 
          onPress: () => onModalHide(),
        }
      ]}
    >
      <Alert type="warning">
        This key must be added to the server`s ~/.ssh/authorized_keys file.
      </Alert>
      
      <div
        className="well"
        style={{
          margin: 0, 
          overflowWrap: 'break-word'
        }}
      >
        { server.public_key }
      </div>
    </Modal>
  )
}

export default ServerKeyModal;
