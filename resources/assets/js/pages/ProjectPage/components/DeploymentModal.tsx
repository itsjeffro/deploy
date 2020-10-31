import * as React from 'react';
import Modal from '../../../components/Modal';

const DeploymentModal = (props) => {
  const {
    isVisible,
    onModalHide,
    deploy,
    project,
    branches,
    tags,
    onDeploymentClick,
    onReferenceChange,
    onNameChange,
  } = props;

  return (
    <Modal
      isVisible={ isVisible }
      id="deploy-modal"
      title="Deploy Project"
      buttons={[
        {
          text: 'Cancel', 
          onPress: () => onModalHide()
        },
        {
          text: 'Deploy',
          onPress: () => onDeploymentClick()
        }
      ]}
    >
      <label>Deploy From</label>

      <div className="form-group">
        <label>
          <input
            name="reference"
            value="default"
            type="radio"
            onChange={ event => onReferenceChange(event) }
            checked={ 'default' === deploy.reference }
          /> Default Branch ({ project.branch })
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            name="reference"
            value="branch"
            type="radio"
            onChange={ event => onReferenceChange(event) }
            checked={ 'branch' === deploy.reference}
          /> A Different Branch
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            name="reference"
            value="tag"
            type="radio"
            onChange={ event => onReferenceChange(event) }
            checked={ 'tag' === deploy.reference }
          /> Tag
        </label>
      </div>

      <div className="form-group">
        <div className="branch-select" style={ deploy.reference === 'branch' ? {} : {display: 'none'}}>
          <label htmlFor="branch-select">Branch</label>
          <select
            className="form-control"
            name="branch"
            id="branch-select"
            onChange={ event => onNameChange(event) }
          >
          {branches.map((branch) =>
            <option
              key={ 'branch' + branch.name }
              value={ branch.name }
            >{ branch.name }</option>
          )}
          </select>
        </div>

        <div className="tag-select" style={ deploy.reference === 'tag' ? {} : {display: 'none'}}>
          <label htmlFor="tag-select">Tag</label>
          <select
            className="form-control"
            name="tag"
            id="tag-select"
            onChange={ event => onNameChange(event) }
          >
          {tags.map(tag =>
            <option
              key={ 'tag' + tag.name}
              value={ tag.name}
            >{tag.name}</option>
          )}
          </select>
        </div>
      </div>
    </Modal>
  )
}

export default DeploymentModal;
