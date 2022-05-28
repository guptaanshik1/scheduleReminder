import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getCurrentUser, getUserDetails } from "../services/authService";

const Navbar = ({ user }) => {
  const [displayedImage, setDisplayedImage] = useState(
    require("../image/profile.png")
  );
  const [userDetails, setUserDetails] = useState();

  const getImage = (user, userDetails) => {
    // console.log(user);
    if (!user || !userDetails) {
      return;
    } else if (!userDetails.profilePicture) {
      return;
    } else {
      const { profilePicture } = userDetails;
      if (Object.keys(profilePicture).length > 0) {
        setDisplayedImage(profilePicture.secure_url);
      }
    }
  };

  const gettingUser = async () => {
    const userDetails = await getUserDetails();
    setUserDetails(userDetails);
  };

  useEffect(() => {
    if (getCurrentUser()) {
      getImage(user, userDetails);
      gettingUser();
    }
  }, userDetails);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary"
      style={{ color: "#fff", marginBottom: "2em" }}
    >
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Time Manager
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link active" aria-current="page" to="/">
                Home
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav">
            {!user && (
              <React.Fragment>
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/login"
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/signup"
                  >
                    Sign Up
                  </NavLink>
                </li>
              </React.Fragment>
            )}
            {user && userDetails && userDetails.role === "user" && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user && userDetails && (
                    <img
                      src={displayedImage}
                      className="rounded-circle"
                      height={40}
                      width={40}
                    />
                  )}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <NavLink to="/userdashboard" className="dropdown-item">
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/changepassword" className="dropdown-item">
                      Change Password
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/settings" className="dropdown-item">
                      Settings
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}
            {user && userDetails && userDetails.role === "admin" && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user && userDetails && userDetails.profilePicture && (
                    <img
                      src={displayedImage}
                      className="rounded-circle"
                      height={40}
                      width={40}
                    />
                  )}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <NavLink to="/admindashboard" className="dropdown-item">
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/changepassword" className="dropdown-item">
                      Change Password
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/settings" className="dropdown-item">
                      Settings
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}
            {user && (
              <li className="nav-item">
                <NavLink
                  className="nav-link active"
                  aria-current="page"
                  to="/logout"
                >
                  Logout
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;