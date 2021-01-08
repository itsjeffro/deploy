import * as React from 'react';

const DataRow = (props: any) => {
  const { rowIndex, row, columns } = props;

  return (
    <tr>
      {columns.map((column: any, index: number) => (
        <td 
          key={ `r:${ rowIndex }-c:${ index }` }
          className={ `text-${ column.align || 'left' }` }
        >
          { row[column.field] || '' }
        </td>
      ))}
    </tr>
  )
};

export default DataRow;
