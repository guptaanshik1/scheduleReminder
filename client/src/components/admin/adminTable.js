import React from "react";
import { Link } from "react-router-dom";
import TableBody from "../common/tableBody";
import TableHeader from "../common/tableHeader";

const AdminTable = ({ sortColumn, onSort, users }) => {
  const columns = [
    {
      path: "name",
      label: "Name",
      content: (user) => (
        <Link to={`/admin/user/${user._id}`}>{user.name}</Link>
      ),
    },
    { path: "email", label: "Email" },
    { path: "occupation", label: "Occupation" },
    { path: "role", label: "Role" },
  ];

  return (
    <table className="table table-dark container">
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody data={users} columns={columns} />
    </table>
  );
};

export default AdminTable;