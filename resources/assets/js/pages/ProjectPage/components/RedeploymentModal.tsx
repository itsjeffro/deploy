import * as React from 'react';
import Modal from '../../../components/Modal';

const RedeploymentModal = (props) => {
  const {
    isVisible,
    onModalHide,
    redeploy,
    onRedeploymentClick,
  } = props;

  const commit = redeploy.commit.substr(0, 7);

  return (
    <Modal
      isVisible={ isVisible }
      id="redeploy-modal"
      title={`Redeploy Commit (${commit})`}
      buttons={[
        {
          text: 'Cancel', 
          onPress: () => onModalHide()
        },
        {
          text: 'Redeploy', 
          onPress: () => onRedeploymentClick()
        }
      ]}
    >
      Are you sure you want to redeploy this commit?
    </Modal>
  )
}

export default RedeploymentModal;
