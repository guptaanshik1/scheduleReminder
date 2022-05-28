import React from "react";
import { Link, Redirect } from "react-router-dom";

import { getCurrentUser } from "../../services/authService";

const AdminDashboard = () => {
  const user = getCurrentUser();
  // if (user.role === "user") return <Redirect to="/userdashboard" />

  return (
    <div className="container text-center">
      <h1>Welcome Admin</h1>
      <Link to="/admin/users" className="btn btn-primary">
        Users
      </Link>
      <Link to="/" className="btn btn-primary m-5">
        Explore
      </Link>
    </div>
  );
};

export default AdminDashboard;