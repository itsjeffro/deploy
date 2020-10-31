import * as React from 'react';

const Dialog = (props) => {
    const {
        id
    } = props;

    return (
        <div className="modal fade" id={id} tabIndex={ -1 } role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default Dialog;
