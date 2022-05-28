import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { adminGetOneUser } from "../../services/adminService";

const AdminSingleUser = () => {
  const [user, setUser] = useState(null);

  const { id } = useParams();
  // console.log(id)

  const getUserDetails = async (id) => {
    const data = await adminGetOneUser(id);
    // console.log(data.data.user.name)
    const { user } = data.data;
    setUser(user);
  };

  useEffect(() => {
    getUserDetails(id);
  }, user);

  console.log(user);

  const handleDelete = async (id) => {
    window.location = "/admin/users";
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <img src="#" className="pic" />
        </div>
      </div>
      <div className="row">
        <div className="col text-center">
          <li className="list-group-item">{user.name}</li>
          <li className="list-group-item">{user.email}</li>
          <li className="list-group-item">{user.occupation}</li>
          <li className="list-group-item">{user.role}</li>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Link to="/userdashboard" className="btn btn-primary mt-4">
            User Schedules
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <button
            className="btn btn-danger mt-4"
            onClick={() => handleDelete(user._id)}
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSingleUser;