import * as React from 'react';

import AlertErrorValidation from '../../../components/AlertErrorValidation';
import Modal from '../../../components/Modal';

const CreateServerModal = (props) => {
  const {
    isVisible,
    onCreateServerClick,
    onHideModalClick,
    onInputChange,
    input,
    isCreating,
    errors,
  } = props;

  return (
    <Modal
      isVisible={ isVisible }
      title="Create Server"
      buttons={[
        {
          text: 'Cancel', 
          onPress: () => onHideModalClick()
        },
        {
          text: isCreating ? 'Working...' : 'Create Server',
          onPress: () => onCreateServerClick()
        }
      ]}
    >
      { (errors || []).length ? <AlertErrorValidation errors={ errors } /> : '' }

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

export default CreateServerModal;
