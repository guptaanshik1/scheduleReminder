import React from "react";

const Search = ({ onSearch, value, toggleSearch }) => {
  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        aria-label="Text input with dropdown button"
        onChange={(e) => onSearch(e.target.value)}
      />
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
    </div>
  );
};

export default Search;