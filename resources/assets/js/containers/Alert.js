import React from 'react';
import {connect} from 'react-redux';

class Alert extends React.Component {
  render() {
    const { alert } = this.props;

    if (alert.message === '') {
      return <></>;
    }

    return (
      <div className="toast toast-success">
        {alert.message}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state.alert;
}

export default connect(mapStateToProps)(Alert);