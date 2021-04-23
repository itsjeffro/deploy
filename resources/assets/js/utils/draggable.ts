const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

export const reorderMap = (items, source, destination) => {
  const current = [...items[source.droppableId]];
  const next = [...items[destination.droppableId]];
  const target = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered = reorder(
      current,
      source.index,
      destination.index,
    );

    return {
      ...items,
      [source.droppableId]: reordered,
    };
  }

  // moving to different list
  // remove from original
  current.splice(source.index, 1);

  // insert into next
  next.splice(destination.index, 0, target);

  return {
    ...items,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };
};