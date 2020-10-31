import * as React from 'react';
import AceEditor from 'react-ace';

import AlertErrorValidation from '../../../components/AlertErrorValidation';
import Modal from '../../../components/Modal';

const AddHookModal = (props) => {
  const {
    isVisible,
    errors,
    hook,
    onInputNameChange,
    onScriptChange,
    onDismissModalClick,
    onAddHookClick,
  } = props;

  return (
    <Modal
      isVisible={ isVisible }
      title="Add Deployment Hook"
      buttons={[
        {
          text: 'Cancel',
          onPress: () => onDismissModalClick(),
        },
        {
          text: 'Save',
          onPress: () => onAddHookClick(),
        },
      ]}
    >
      { errors.length ? <AlertErrorValidation errors={ errors } /> : '' }

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          className="form-control"
          name="name"
          type="text"
          id="name"
          onChange={ event => onInputNameChange(event) }
          value={ hook.name }
        />
      </div>

      <div className="form-group">
        <label htmlFor="script">Script</label>
        <AceEditor
          mode="powershell"
          theme="github"
          name="editor-add"
          onChange={ event => onScriptChange(event) }
          style={{
            height: 200,
            width: '100%',
            fontSize: '15px',
            lineHeight: '21px'
          }}
          value={ hook.script }
        />
        <textarea
          name="script"
          style={{ display: 'none' }}
          value={ hook.script }
          readOnly
        />
      </div>
    </Modal>
  )
}

export default AddHookModal;
