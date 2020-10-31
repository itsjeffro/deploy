import * as React from 'react';

const DialogContent = (props) => {
    return (
        <div className="modal-body">
            {props.children}
        </div>
    )
}

export default DialogContent;
