import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { alertHide } from '../actions/alert';

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    const { dispatch } = this.props;

    dispatch(alertHide());
  }
  
  render() {
    const { alert } = this.props;

    return (
      <div>
        <nav className="navbar navbar-default navbar-static-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                <span className="sr-only">Toggle Navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>

              <Link className="navbar-brand" to="/">
                Deployment Manager
              </Link>
            </div>

            <div className="collapse navbar-collapse" id="app-navbar-collapse">
              <ul className="nav navbar-nav">
                <li>
                  <Link to="/">Dashboard</Link>
                </li>
              </ul>

              <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                     Welcome <span className="caret"></span>
                  </a>

                  <ul className="dropdown-menu" role="menu">
                    <li>
                      <Link to="/account">Account</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div
          className="navbar-alert alert alert-success"
          style={{display: (alert.show ? '' : 'none')}}
        >
          <div className="container">
            <button 
              type="button" 
              className="close" 
              onClick={this.handleOnClick}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            {alert.message}
            </div>
        </div>

        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state.alert;
};

export default connect(
  mapStateToProps
)(Layout);