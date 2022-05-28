import React from "react";

const Filters = ({ filters, onFilterSelect, selectedFilter }) => {
  return (
    <div
      className="btn-group mt-2"
      role="group"
      aria-label="Button group with nested dropdown"
    >
      <div className="btn-group" role="group">
        <button
          id="btnGroupDrop1"
          type="button"
          className="btn btn-primary dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Filter By
        </button>
        <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
          {filters.map((filter) => (
            <li
              onClick={() => onFilterSelect(filter)}
              className={
                filter === selectedFilter
                  ? "list-group-item active"
                  : "list-group-item"
              }
              key={filter}
            >
              {filter}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Filters;