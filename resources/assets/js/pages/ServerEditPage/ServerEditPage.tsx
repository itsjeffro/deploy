import * as React from 'react';
import { connect } from 'react-redux';

import { createToast } from '../../state/alert/alertActions';
import Loader from '../../components/Loader';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import ServerEditForm from './components/ServerEditForm';
import { getServer, updateServer } from "../../state/servers/actions";
import PanelHeading from "../../components/PanelHeading";
import Panel from "../../components/Panel";
import ProjectsTable from "./components/ProjectsTable";

class ServerEditPage extends React.Component<any> {
  state = {
    serverId: null,
    input: {},
    isUpdated: false,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: {
          server_id,
        }
      }
    } = this.props;

    dispatch(getServer(server_id));

    this.setState({ serverId: server_id });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { dispatch, servers } = this.props;

    // Handle server change
    if (servers.item !== nextProps.servers.item) {
      this.setState({ input: nextProps.servers.item || {} });
    }

    // Handler server update
    if (nextProps.servers.isUpdated !== servers.isUpdated && nextProps.servers.isUpdated) {
      dispatch(createToast('Server updated successfully.'));
    }
  }

  /**
   * Handle input change when updating a server.
   */
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    let server = {
      ...this.state.input,
      [name]: value,
    };

    this.setState({ input: server });
  };

  /**
   * Handles updating a server.
   */
  handleClick = (): void => {
    const { 
      dispatch,
      match: {
        params: {
          server_id,
        },
      },
    } = this.props;

    const { input } = this.state;

    dispatch(updateServer(server_id, input));
  };

  render() {
    const { servers } = this.props;
    const { input } = this.state;
  
    const columns = [
      { field: 'name', headerName: 'Project name' },
    ];

    return (
      <Layout>
        <div className="content">
          <div className="container-fluid heading">
            <h2>Edit server</h2>
          </div>
          
          <Container fluid>
            { servers.isFetching
              ? <Loader />
              : <>
                <ServerEditForm
                  isUpdating={ servers.isUpdating }
                  server={ input }
                  onClick={ this.handleClick }
                  onInputChange={ this.handleInputChange }
                  errors={ servers.errors }
                />
                <Panel>
                  <PanelHeading>
                    <h5 className="panel-title">Projects using this server</h5>
                  </PanelHeading>
                  <ProjectsTable projects={ servers.item.projects || [] } />
                </Panel>
              </>
            }
          </Container>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    servers: state.servers,
  };
};

export default connect(
  mapStateToProps
)(ServerEditPage);
