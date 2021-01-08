import * as React from 'react';

const Modal = (props) => {
  const {
    isVisible,
    buttons,
    id,
    title,
  } = props;

  const styleDisplay = isVisible ? 'block'  : 'none';
  const className = isVisible ? 'modal in' : 'modal';

  return (
    <div 
      className="modal-wrapper"
      style={{
        display: styleDisplay
      }}
    >
      <div 
        className={ className } 
        id={ id } 
        tabIndex={ -1 } 
        role="dialog"
        style={{
          display: styleDisplay
        }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {title ? 
              <div className="modal-header"><h4 className="modal-title">{title}</h4></div>
              : ''
            }

            <div className="modal-body">
              { props.children }
            </div>

            {buttons ?
              <div className="modal-footer">
                {buttons.map((button) =>
                  <button
                    key={ button.text.toLowerCase() }
                      className="btn btn-default"
                      onClick={ e => button.onPress() }
                  >{ button.text }</button>
                )}
              </div>
              : ''
            }
          </div>
        </div>
      </div>
      <div className={ isVisible ? 'modal-backdrop fade show' : 'modal-backdrop fade' }></div>
    </div>
  )
}

export default Modal;
