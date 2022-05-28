import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return <Redirect to="/login" />;
    setUser(user);
  }, user);

  return (
    <Route
      //   path={path}
      {...rest}
      render={(props) => {
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;