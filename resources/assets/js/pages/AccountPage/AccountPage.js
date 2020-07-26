import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Deploy } from '../../config';

import Container from '../../components/Container';
import Grid from '../../components/Grid';
import Icon from '../../components/Icon';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelBody from '../../components/PanelBody';
import Layout from "../../components/Layout";
import { fetchAccountProviders } from '../../state/accountProviders/actions';

class AccountPage extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(fetchAccountProviders());
  }

  render() {
    const { accountProviders } = this.props;

    return (
      <Layout>
        <div className="content">
          <div className="container-fluid heading">
            <h2>Account Settings</h2>
          </div>

          <Container fluid>
            <div className="row">
              <Grid xs={12} sm={3}>
                <Panel>
                  <PanelHeading>
                    <h3 className="panel-title">Account Settings</h3>
                  </PanelHeading>

                  <div className="list-group">
                    <Link to={ '/account' } className="list-group-item">Integrations</Link>
                  </div>
                </Panel>
              </Grid>

              <Grid xs={12} sm={9}>
                {accountProviders.items.map(provider =>
                  <Panel key={provider.id}>
                    <PanelHeading>
                      <Icon iconName={provider.friendly_name} /> {provider.name}
                    </PanelHeading>
                    <PanelBody>
                      <a
                        className="btn btn-default"
                        href={Deploy.path + '/authorize/' + provider.friendly_name}
                        title={'Connect to ' + provider.name}
                      >{provider.deploy_access_token ? 'Refresh Token' : 'Connect to ' + provider.name}</a>
                    </PanelBody>
                  </Panel>
                )}
              </Grid>
            </div>
          </Container>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accountProviders: state.accountProviders,
  };
};

export default connect(mapStateToProps)(AccountPage);
