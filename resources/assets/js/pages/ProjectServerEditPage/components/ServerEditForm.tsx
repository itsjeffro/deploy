import * as React from 'react';
import AlertErrorValidation from '../../../components/AlertErrorValidation';
import Button from '../../../components/Button';
import Panel from '../../../components/Panel';
import PanelBody from '../../../components/PanelBody';
import PanelHeading from '../../../components/PanelHeading';
import PanelTitle from '../../../components/PanelTitle';

const ServerEditForm = (props: any) => {
  const {
    isUpdating,
    errors,
    onClick,
    onInputChange,
    server,
  } = props;

  return (
    <Panel>
      <PanelHeading>
        <PanelTitle>Edit Server</PanelTitle>
      </PanelHeading>

      <PanelBody>
        {errors.length ? <AlertErrorValidation errors={ errors } /> : ''}

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input className="form-control" name="name" type="text" id="name" onChange={ (e) => onInputChange(e) } value={ server.name } />
        </div>

        <div className="row">
          <div className="form-group col-xs-8 col-md-9">
            <label htmlFor="ip_address">Ip Address</label>
            <input className="form-control" name="ip_address" type="text" id="ip_address" onChange={ (e) => onInputChange(e) } value={ server.ip_address } />
          </div>
          <div className="form-group col-xs-4 col-md-3">
            <label htmlFor="port">Port</label>
            <input className="form-control" name="port" type="text" id="port" onChange={ (e) => onInputChange(e) } value={ server.port } placeholder="22" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="connect_as">Connect As</label>
          <input className="form-control" name="connect_as" type="text" id="connect_as" onChange={ (e) => onInputChange(e) } value={ server.connect_as } />
        </div>

        <div className="form-group">
          <label htmlFor="project_path">Project Path</label>
          <input className="form-control" name="project_path" type="text" id="project_path" onChange={ (e) => onInputChange(e) } value={ server.project_path } />
        </div>

        <Button color="primary" onClick={ () => onClick() }>{ isUpdating ? 'Working...' : 'Save Server' }</Button>
      </PanelBody>
    </Panel>
  )
}

export default ServerEditForm;
