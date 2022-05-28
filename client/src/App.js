import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Home from "./components/home";
import Navbar from "./components/navbar";
import Signup from "./components/signup";
import Login from "./components/login";
import Logout from "./components/logout";
import UserDashboard from "./components/userDashboard";
import ProtectedRoute from "./components/common/protectedRoute";
import AdminDashboard from "./components/admin/adminDashboard";
import { getCurrentUser, getUserDetails } from "./services/authService";
import ForgotPassword from "./components/common/forgotPassword";
import ResetPassword from "./components/common/resetPassword";

import Schedules from "./components/schedules";
import TimeTable from "./components/timeTable";
import Users from "./components/admin/users";
import AdminSingleUser from "./components/admin/adminSingleUser";
import Settings from "./components/settings";
import ImageUpload from "./components/imageUpload";
import ChangePassword from "./components/common/changePassword";

const App = () => {
  const [user, setUser] = useState();
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);
  }, user);

  const gettingUser = async () => {
    try {
      const userDetails = await getUserDetails();
      setUserDetails(userDetails);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <Router>
      <Navbar user={user} userDetails={userDetails} />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/logout" component={Logout} />
        <Route path="/forgotpassword" component={ForgotPassword} />
        <Route path="/password/reset/:token" component={ResetPassword} />
        {/* <Route path="/userdashboard" render={props => {
          if (!user) return <Redirect to="/login" />
          return <UserDashboard />
        }} /> */}
        <ProtectedRoute path="/upload" component={ImageUpload} />
        <Route
          path="/upload"
          render={(props) => {
            if (!user) return <Redirect to="/login" />;
            return <ImageUpload user={user} userDetails={userDetails} />;
          }}
        />
        <ProtectedRoute path="/userdashboard" component={UserDashboard} />
        <ProtectedRoute path="/changepassword" component={ChangePassword} />
        {/* <ProtectedRoute
          path="/settings"
          render={props => {return <Settings {...props} userDetails={userDetails}/>}}
        /> */}
        <Route
          path="/settings"
          render={(props) => {
            if (!user) return <Redirect to="/login" />;
            return <Settings userDetails={userDetails} />;
          }}
        />
        <ProtectedRoute path="/schedules" component={Schedules} />
        <ProtectedRoute path="/timetable" component={TimeTable} />
        <ProtectedRoute path="/admin/user/:id" component={AdminSingleUser} />
        <ProtectedRoute path="/admindashboard" component={AdminDashboard} />
        <ProtectedRoute path="/admin/users" component={Users} />
        <Route path="/" exact component={Home} />
      </Switch>
    </Router>
  );
};

export default App;