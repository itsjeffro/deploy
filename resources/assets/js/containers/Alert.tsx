import * as React from 'react';
import {connect} from 'react-redux';

class Alert extends React.Component<any> {
  render() {
    const { toasts } = this.props;

    return (
      <ul className="toasts">
        {(toasts||[]).map((toast) => (
          <li key={toast.id} className="toast toast-success">
            {toast.message}
          </li>
        ))}
      </ul>
    )
  }
}

const mapStateToProps = (state) => {
  return state.alert;
}

export default connect(mapStateToProps)(Alert);