import * as React from 'react';

import AlertErrorValidation from '../../../components/AlertErrorValidation';
import TextField from '../../../components/TextField';
import Modal from '../../../components/Modal';
import {NavLink} from "react-router-dom";

const AddProjectModal = (props) => {
  const {
    isVisible,
    accountProviders,
    handleCreateProjectClick,
    handleDismissModalClick,
    handleInputChange,
    projects,
    input,
  } = props;

  const addProjectText = projects.isCreating ? 'Working...' : 'Add Project';

  const providers = accountProviders.filter((accountProvider) => accountProvider.is_connected);

  return (
    <Modal
      isVisible={ isVisible }
      title="Add Project"
      buttons={[
        {
          text: 'Cancel', 
          onPress: () => handleDismissModalClick()
        },
        {
          text: addProjectText,
          onPress: () => handleCreateProjectClick()
        }
      ]}
    >
      { projects.errors.length ? <AlertErrorValidation errors={ projects.errors } /> : '' }

      <h4>Project Details</h4>

      <div className="form-group">
        <TextField 
          id="name" 
          label="Project Name"
          onChange={ e => handleInputChange(e) } 
          name="name"
          value={ input.name || '' }
          isRequired
        />
      </div>

      <h4>Source Control</h4>

      <div className="form-group">
        <label>Providers</label>

        { providers.length === 0
          ? <div>Add an <NavLink to="account">account provider</NavLink></div>
          : '' }

        { providers
          .map((accountProvider) => (
            <div key={ accountProvider.id }>
              <label className="form-control-label" htmlFor={accountProvider.name}>
                <input 
                  name="provider_id"
                  type="radio"
                  value={ accountProvider.id }
                  id={ accountProvider.name }
                  onChange={ (e) => handleInputChange(e) }
                  checked={ input.provider_id == accountProvider.id }
                /> { accountProvider.name }
              </label>
            </div>
          )) }
      </div>

      <div className="form-group">
        <TextField 
          id="repository" 
          label="Respository" 
          onChange={ (e) => handleInputChange(e) } 
          name="repository"
          placeholder="user/repository"
          value={ input.repository || '' }
          isRequired
        />
      </div>
    </Modal>
  )
};

export default AddProjectModal;
