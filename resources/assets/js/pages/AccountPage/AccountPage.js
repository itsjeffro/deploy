import React from 'react';
import { Link } from 'react-router-dom';

import AccountProviderService from '../../services/AccountProvider';

import Icon from '../../components/Icon';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelBody from '../../components/PanelBody';
import Button from '../../components/Button';

class AccountPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      providers: []
    }

    this.handleConnectClick = this.handleConnectClick.bind(this);
  }

  componentWillMount() {
    let accountProviderService = new AccountProviderService;

    accountProviderService
      .index('/api/account-providers')
      .then(response => {
        this.setState({
          providers: response.data
      });
    });
  }

  /**
   * Handle connect to provider.
   * 
   * @param {object} provider
   */
  handleConnectClick(provider) {
    //
  }

  render() {
    const { providers } = this.state;

    return (
      <div>
        <div className="breadcrumbs">
          <div className="container">
            <div className="pull-left">
              <span className="heading">Account Settings</span>
            </div>
          </div>
        </div>

        <div className="container content">
          <div className="row">
            <div className="col-xs-12 col-sm-3">
              <Panel>
                <PanelHeading>
                  <h3 className="panel-title">Account Settings</h3>
                </PanelHeading>
    
                <div className="list-group">
                  <Link to={'/account'} className="list-group-item">Integrations</Link>
                </div>
              </Panel>
            </div>
            
            <div className="col-xs-12 col-sm-9">
              {providers.map(provider =>
                <Panel>
                  <PanelHeading>
                    <Icon iconName={provider.friendly_name} /> {provider.name}
                  </PanelHeading>
                  <PanelBody>
                    <Button
                      onClick={this.handleConnectClick(provider)}
                    >{provider.deploy_access_token ? 'Refresh Token' : 'Connect to ' + provider.name}</Button>
                  </PanelBody>
                </Panel>
              )}
            </div>
          </div>
        </div>            
      </div>
    )
  }
}

export default AccountPage;