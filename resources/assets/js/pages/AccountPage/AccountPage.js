import React from 'react';

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
          <Panel>
            <PanelHeading>
              <Icon iconName="github" /> Github
            </PanelHeading>
            <PanelBody>
              <Button
                onClick={this.handleConnectClick('github')}
              >Connect to Github</Button>
            </PanelBody>
          </Panel>
          
          <Panel>
            <PanelHeading>
              <Icon iconName="bitbucket" /> Bitbucket
            </PanelHeading>
            <PanelBody>
              <Button
                onClick={this.handleConnectClick('bitbucket')}
              >Connect to Bitbucket</Button>
            </PanelBody>
          </Panel>
        </div>            
      </div>
    )
  }
}

export default AccountPage;