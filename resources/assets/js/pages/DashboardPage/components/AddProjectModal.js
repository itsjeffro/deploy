import React from 'react';

import AlertErrorValidation from '../../../components/AlertErrorValidation';
import TextField from '../../../components/TextField';
import Modal from '../../../components/Modal';

const AddProjectModal = props => {
  const {
    isVisible,
    grantedProviders,
    handleCreateProjectClick,
    handleDismissModalClick,
    handleInputChange,
    projects,
  } = props;

  const addProjectText = projects.isCreating ? 'Working...' : 'Add Project';

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
        />
      </div>

      <h4>Source Control</h4>

      <div className="form-group">
        <label>Providers</label>

        {grantedProviders.map(grantedProvider => (
          <div key={grantedProvider.id}>
            <label htmlFor={grantedProvider.name}>
              <input 
                name="provider_id"
                type="radio"
                value={grantedProvider.id}
                id={grantedProvider.name}
                onChange={e => handleInputChange(e)}
              /> {grantedProvider.name}
            </label>
          </div>
        ))}
      </div>

      <div className="form-group">
        <TextField 
          id="repository" 
          label="Respository" 
          onChange={e => handleInputChange(e)} 
          name="repository"
          placeholder="user/repository"
        />
      </div>
    </Modal>
  )
};

export default AddProjectModal;
