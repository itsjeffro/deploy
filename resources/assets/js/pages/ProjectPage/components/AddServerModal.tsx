import * as React from 'react';
import Select from 'react-select'

import AlertErrorValidation from '../../../components/AlertErrorValidation';
import Modal from '../../../components/Modal';
import Grid from "../../../components/Grid";

interface PropsInterface {
  isVisible: boolean
  onCreateServerClick: Function
  onHideModalClick: Function
  onInputChange: Function
  isCreating: boolean
  input: any
  errors: any[]
  servers: any[]
}

const AddServerModal = (props: PropsInterface) => {
  const {
    isVisible,
    onCreateServerClick,
    onHideModalClick,
    onInputChange,
    input,
    isCreating,
    errors,
    servers,
  } = props;

  const serverOptions = servers.map((server) => ({
    label: server.name,
    value: server.id,
  }));

  return (
    <Modal
      isVisible={ isVisible }
      title="Add Server"
      buttons={[
        {
          text: 'Cancel', 
          onPress: () => onHideModalClick()
        },
        {
          text: isCreating ? 'Working...' : 'Add Server',
          onPress: () => onCreateServerClick()
        }
      ]}
    >
      { (errors || []).length ? <AlertErrorValidation errors={ errors } /> : '' }

      <div className="form-group">
        <label htmlFor="name">Server options</label>
        <div className="row">
          <Grid sm={ 12 }>
            <label className="form-control-label" htmlFor="new-server">
              <input
                name="server_options"
                type="radio"
                value="new-server"
                id="new-server"
              /> Create a new server and SSH key
            </label>
          </Grid>

          <Grid sm={ 12 }>
            <label className="form-control-label" htmlFor="existing-server">
              <input
                name="server_options"
                type="radio"
                value="existing-server"
                id="existing-server"
              /> Use an existing server and SSH key
            </label>
          </Grid>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="name">Server</label>
        <Select
          options={ serverOptions }
          onChange={ (value) => console.log(value) }
          isClearable
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          className="form-control"
          name="name"
          type="text"
          id="name"
          onChange={ (e) => onInputChange(e) }
          value={ input.name }
        />
      </div>

      <div className="row">
        <div className="form-group col-xs-8 col-md-9">
          <label htmlFor="ip_address">Ip Address</label>
          <input
            className="form-control"
            name="ip_address"
            type="text"
            id="ip_address"
            onChange={ (e) => onInputChange(e) }
            value={ input.ip_address }
          />
        </div>

        <div className="form-group col-xs-4 col-md-3">
          <label htmlFor="port">Port</label>
          <input
            className="form-control"
            name="port"
            type="text"
            id="port"
            onChange={ (e) => onInputChange(e) }
            value={ input.port }
            placeholder="22"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="connect_as">Connect As</label>
        <input
          className="form-control"
          name="connect_as"
          type="text"
          id="connect_as"
          onChange={ (e) => onInputChange(e) }
          value={ input.connect_as }
        />
      </div>

      <div className="form-group">
        <label htmlFor="project_path">Project Path</label>
        <input
          className="form-control"
          name="project_path"
          type="text"
          id="project_path"
          onChange={ (e) => onInputChange(e) }
          value={ input.project_path }
        />
      </div>
    </Modal>
  )
};

export default AddServerModal;
