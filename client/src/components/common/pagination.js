import React from "react";
import _ from "lodash";
import propTypes from "prop-types";

const Pagination = ({
  currentPage,
  itemsCount,
  pageSize,
  onPageChange,
  onPrevPageChange,
  onNextPageChange,
}) => {
  if (itemsCount === 0) return null;
  const pagesCount = Math.ceil(itemsCount / pageSize); // this is the total number of pages
  // creating an array from 1 to pagesCount

  // console.log(itemsCount, pageSize)
  // console.log(currentPage)
  if (pagesCount === 1) return null;
  const pagesArray = _.range(1, pagesCount + 1); // this method will create array as 1, 2, 3, 4, ....
  const lastPage = pagesArray.length;

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
          <a
            className="page-link"
            aria-label="Previous"
            onClick={() => onPrevPageChange(currentPage)}
          >
            <span aria-hidden="true">Previous</span>
          </a>
        </li>
        {pagesArray.map((page) => (
          <li
            key={page}
            className={page === currentPage ? "page-item active" : "page-item"}
            style={{ cursor: "pointer" }}
          >
            <a className="page-link" onClick={() => onPageChange(page)}>
              <span aria-hidden="true">{page}</span>
            </a>
          </li>
        ))}
        <li
          className={
            currentPage === lastPage ? "page-item disabled" : "page-item"
          }
        >
          <a
            className="page-link"
            aria-label="Next"
            onClick={() => onNextPageChange(currentPage)}
          >
            <span aria-hidden="true">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  itemsCount: propTypes.number.isRequired,
  pageSize: propTypes.number.isRequired,
  currentPage: propTypes.number.isRequired,
  onPageChange: propTypes.func.isRequired,
  onPrevPageChange: propTypes.func.isRequired,
  onNextPageChange: propTypes.func.isRequired,
};

export default Pagination;