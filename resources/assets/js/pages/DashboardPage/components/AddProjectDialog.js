import React from 'react';

import AlertErrorValidation from '../../../components/AlertErrorValidation';
import Button from '../../../components/Button';
import Dialog from '../../../components/Dialog';
import DialogActions from '../../../components/DialogActions';
import DialogContent from '../../../components/DialogContent';
import DialogTitle from '../../../components/DialogTitle';
import TextField from '../../../components/TextField';

const AddProjectDialog = props => {
  const {
    grantedProviders,
    handleCreateProjectClick,
    handleDismissModalClick,
    handleInputChange,
    projects,
  } = props;

  return (
    <Dialog id="project-create-modal">
      <DialogTitle>
        Add Project
      </DialogTitle>
      <DialogContent>
        {projects.errors.length ? <AlertErrorValidation errors={projects.errors} /> : ''}

        <h4>Project Details</h4>
        <div className="form-group">
          <TextField 
            id="name" 
            label="Project Name" 
            onChange={e => handleInputChange(e)} 
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
      </DialogContent>
      <DialogActions>
        <Button
          onClick={e => handleDismissModalClick()}
        >Cancel</Button>

        <Button
          color="primary"
          onClick={e => handleCreateProjectClick()}
        >{projects.isCreating ? 'Working...' : 'Add Project'}</Button>
      </DialogActions>
    </Dialog>
  )
};

export default AddProjectDialog;