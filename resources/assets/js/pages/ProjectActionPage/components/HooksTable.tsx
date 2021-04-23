import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import PanelHeading from "../../../components/PanelHeading";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import PanelTitle from "../../../components/PanelTitle";
import Panel from "../../../components/Panel";
import HooksTableRow from "./HooksTableRow";

const HooksTable = (props) => {
  const {
    droppableId,
    label,
    hookPosition,
    hooks,
    handleAddModalClick,
    handleEditModalClick,
    handleRemoveModalClick,
  } = props;

  return (
    <Panel>
      <PanelHeading>
        <div className="pull-right">
          <Button
            onClick={ () => handleAddModalClick(hookPosition) }
          ><Icon iconName="plus" /> Add Hook</Button>
        </div>
        <PanelTitle><Icon iconName="code" /> { label }</PanelTitle>
      </PanelHeading>

      <Droppable droppableId={ droppableId }>
        {(provided) => (
          <div
            className="hook__container"
            ref={ provided.innerRef }
            { ...provided.droppableProps }
          >
            { hooks.length === 0 ? <div className="hook__row empty"><div className="hook__row-base">No hooks added yet</div></div> : '' }

            {hooks.map((hook, index) =>
              <HooksTableRow
                key={ `${droppableId}-${hook.id}` }
                hook={ hook }
                index={ index }
                handleEditModalClick={ handleEditModalClick }
                handleRemoveModalClick={ handleRemoveModalClick }
              />
            )}
            { provided.placeholder }
          </div>
        )}
      </Droppable>
    </Panel>
  )
}

export default HooksTable;
