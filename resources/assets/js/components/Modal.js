import React from 'react';

const Modal = props => {
    const {
        buttons,
        id,
        title
    } = props;

    return (
        <div className="modal fade" id={id} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    {title
                        ? <div className="modal-header"><h4 className="modal-title">{title}</h4></div>
                        : ''
                    }

                    <div className="modal-body">
                        {props.children}
                    </div>

                    {buttons
                        ?
                        <div className="modal-footer">
                            {buttons.map(button =>
                                <button
                                	key={button.text.toLowerCase()}
                                    className="btn btn-default"
                                    onClick={e => button.onPress()}
                                >{button.text}</button>
                            )}
                        </div>
                        : ''
                    }
                </div>
            </div>
        </div>
    )
}

export default Modal;