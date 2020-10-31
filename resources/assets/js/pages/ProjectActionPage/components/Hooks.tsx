import * as React from 'react';

import HooksTable from './HooksTable';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Panel from '../../../components/Panel';
import PanelHeading from '../../../components/PanelHeading';
import PanelTitle from '../../../components/PanelTitle';
import PanelBody from '../../../components/PanelBody';
import Grid from '../../../components/Grid';

const Hooks = (props) => {
  const {
    beforeHooks,
    afterHooks,
    onAddModalClick,
    onEditModalClick,
    onRemoveModalClick,
  } = props;

  return (
    <div className="row">
      <Grid xs={ 12 } sm={ 6 }>
        <Panel>
          <PanelHeading>
            <div className="pull-right">
              <Button
                onClick={ () => onAddModalClick(1) }
              ><Icon iconName="plus" /> Add Hook</Button>
            </div>
            <PanelTitle><Icon iconName="code" /> Before This Action</PanelTitle>
          </PanelHeading>

          <HooksTable
          	hooks={ beforeHooks }
          	onHandleEditClick={ onEditModalClick }
          	onHandleRemoveClick={ onRemoveModalClick }
          />
        </Panel>
      </Grid>

      <Grid xs={ 12 } sm={ 6 }>
        <Panel>
          <PanelHeading>
            <div className="pull-right">
              <Button
                onClick={() => onAddModalClick(2)}
              ><Icon iconName="plus" /> Add Hook</Button>
            </div>
            <PanelTitle><Icon iconName="code" /> After This Action</PanelTitle>
          </PanelHeading>

          <HooksTable
          	hooks={ afterHooks }
          	onHandleEditClick={ onEditModalClick }
          	onHandleRemoveClick={ onRemoveModalClick }
          />
        </Panel>
        </Grid>
    </div>
  )
}

export default Hooks;
