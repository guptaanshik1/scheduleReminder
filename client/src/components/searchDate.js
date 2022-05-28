import React from "react";

const SearchDate = ({ toggleSearch, schedules }) => {
  const { startDate, endDate } = schedules;

  // const searchSchedulesByDate = () => {

  // }

  return (
    <React.Fragment>
      <div class="input-group">
        <span class="input-group-text">From Date:</span>
        <input type="date" class="form-control" />
        <span class="input-group-text">To Date:</span>
        <input type="date" class="form-control" />
        <button
          className="btn btn-secondary"
          type="button"
          // onClick={searchSchedulesByDate}
        >
          Search
        </button>
      </div>
      <br />
      <button
        className="btn btn-outline-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Search By
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <a className="dropdown-item" onClick={toggleSearch}>
            Search By Title
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <a className="dropdown-item" onClick={toggleSearch}>
            Search By Date
          </a>
        </li>
      </ul>
      <br />
      <br />
    </React.Fragment>
  );
};

export default SearchDate;