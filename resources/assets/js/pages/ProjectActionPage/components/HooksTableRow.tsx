import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Button from "../../../components/Button";

const HooksTableRow = (props) => {
  const {
    hook,
    index,
    handleEditModalClick,
    handleRemoveModalClick,
  } = props;

  return (
    <Draggable key={ hook.id } draggableId={ hook.id.toString() } index={ index }>
      {(provided) => (
        <div
          className="hook__row"
          ref={ provided.innerRef }
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }
        >
          <div className="hook__row-base">
            { hook.name }

            <div className="hook__actions">
              <Button onClick={() => handleEditModalClick(hook)}>Edit</Button>{' '}
              <Button onClick={() => handleRemoveModalClick(hook)}>Remove</Button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default HooksTableRow;
