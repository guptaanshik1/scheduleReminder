import React from "react";
import { Redirect } from "react-router-dom";
import Card from "./common/card";
import { getCurrentUser } from "../services/authService";

const UserDashboard = () => {
  const user = getCurrentUser();
  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container">
      <Card
        heading="Schedules"
        text="Here are your schedules"
        description="You can schedule your activities here"
        linkLabel="See schedules"
        link="/schedules"
      />
      <br />
      <Card
        heading="Time Table"
        text="You have not created your time table yet"
        description="You can schedule your daily chores here"
        linkLabel="See Time-Table"
        link="#"
      />
    </div>
  );
};

export default UserDashboard;