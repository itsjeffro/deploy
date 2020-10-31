import * as React from 'react';

const DialogTitle = (props) => {
    const {
        showCloseButton
    } = props;

    return (
        <div className="modal-header">
            {showCloseButton ? <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button> : ''}

            <h4 className="modal-title">{props.children}</h4>
        </div>
    )
}

export default DialogTitle;
