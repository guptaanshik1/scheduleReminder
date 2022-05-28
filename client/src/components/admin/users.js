import React, { useState, useEffect } from "react";
import _ from "lodash";
import AdminTable from "./adminTable";
import Pagination from "../common/pagination";

import { adminGetUsers } from "../../services/adminService";
import { paginate } from "../../utils/paginate";

const Users = () => {
  // const currentUser = getCurrentUser()
  // if (currentUser.role === 'user') return <Redirect to="/userdashboard" />

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchUsers = async () => {
    const data = await adminGetUsers();
    const { users } = data.data;
    setUsers(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [sortColumn, setSortColumn] = useState({
    path: "name",
    order: "asc",
  });

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPageChange = (page) => {
    setCurrentPage(page - 1);
  };

  const handleNextPageChange = (page) => {
    setCurrentPage(page + 1);
  };

  if (users.length === 0)
    return (
      <h1 className="container text-center">There are no users to show</h1>
    );

  const sortedUsers = _.orderBy(users, [sortColumn.path], [sortColumn.order]);
  const count = sortedUsers.length;
  const pagedUsers = paginate(sortedUsers, currentPage, pageSize);

  return (
    <React.Fragment>
      <AdminTable
        sortColumn={sortColumn}
        onSort={handleSort}
        users={pagedUsers}
      />
      <Pagination
        itemsCount={count}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPrevPageChange={handlePrevPageChange}
        onNextPageChange={handleNextPageChange}
      />
    </React.Fragment>
  );
};

export default Users;