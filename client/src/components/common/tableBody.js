import React from "react";
import _ from "lodash";

const TableBody = ({ data, columns }) => {
  const renderCell = (currentItem, column) => {
    if (column.content) return column.content(currentItem); // calling the function in content and that function will return a react element

    return _.get(currentItem, column.path);
  };

  const renderKey = (item, column) => {
    return item._id + (column.path || column.key);
  };

  return (
    <tbody>
      {data.map((item) => (
        <tr key={item._id}>
          {/* {columns.map(column => <td>{item[column]}</td>)} item is object and column is property*/}
          {columns.map((column) => (
            <td key={renderKey(item, column)}>{renderCell(item, column)}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;