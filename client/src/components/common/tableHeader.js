import React from "react";

const TableHeader = ({ sortColumn, onSort, columns }) => {
  const raiseSort = (path) => {
    // this method will be responsible for determining the sort order
    const sortColumnClone = { ...sortColumn };
    if (sortColumnClone.path === path) {
      sortColumnClone.order = sortColumnClone.order === "asc" ? "desc" : "asc";
    } else {
      sortColumnClone.path = path;
      sortColumnClone.order = "asc";
    }
    onSort(sortColumnClone); // this will call handleSort from displaySchedules
  };

  const renderSortIcon = (column) => {
    if (!column.path) return null;
    if (column.path !== sortColumn.path) return null;
    if (sortColumn.order === "asc") return <i className="fa fa-sort-asc"></i>;
    return <i className="fa fa-sort-desc"></i>;
  };

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.path || column.key}
            onClick={() => raiseSort(column.path)}
          >
            {column.label} {renderSortIcon(column)}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;