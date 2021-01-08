import * as React from 'react';
import DataRow from './DataRow';

const DataGrid = (props: any) => {
  const { columns, rows } = props;

  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((column: any, index: number) => (
            <th key={ `c:${ index }`}>{ column.headerName }</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row: any, index: number) => (
          <DataRow key={ `r:${ index }` } rowIndex={ index } row={ row } columns={ columns } />
        ))}
      </tbody>
    </table>
  );
}

export default DataGrid;
