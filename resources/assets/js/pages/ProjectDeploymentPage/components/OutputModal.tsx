import * as React from 'react';
import Modal from '../../../components/Modal';

const OutputModal = (props) => {
  const {
    isVisible,
    onModalHide,
    processOutput,
  } = props;

  return (
    <Modal
      isVisible={ isVisible }
      title="Process Output"
      buttons={[
        {
          text: 'Close',
          onPress: () => onModalHide(),
        }
      ]}
    >
      <div
        className="well"
        style={{
          marginBottom: 0,
          whiteSpace: 'pre-line',
          overflowX: 'auto',
        }}
      >
        { processOutput }
      </div>
    </Modal>
  )
}

export default OutputModal;
