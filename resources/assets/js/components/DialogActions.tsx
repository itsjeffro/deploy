import * as React from 'react';

const DialogActions = (props) => {
    return (
        <div className="modal-footer">
            {props.children}
        </div>
    )
}

export default DialogActions;
