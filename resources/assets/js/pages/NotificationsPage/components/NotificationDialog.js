import React from 'react';

import Button from '../../../components/Button';
import Dialog from '../../../components/Dialog';
import DialogActions from '../../../components/DialogActions';
import DialogContent from '../../../components/DialogContent';
import DialogTitle from '../../../components/DialogTitle';

const NotificationDialog = (props) => {
  const {
    notification,
    onDismissModalClick,
  } = props;

  return (
    <Dialog id="notification-modal">
      <DialogTitle>
        Notification #{ notification.id }
      </DialogTitle>
      <DialogContent>
        <div               
          style={{
            marginBottom: 0,
            whiteSpace: 'pre-line',
            overflowX: 'auto'
          }}
        >{ notification.contents }</div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={e => onDismissModalClick()}
        >Close</Button>
      </DialogActions>
    </Dialog>
  )
};

export default NotificationDialog;
