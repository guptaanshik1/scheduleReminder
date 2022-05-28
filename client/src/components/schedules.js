import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import CreateSchedule from "./createSchedule";
import DisplaySchedules from "./displaySchedules";
import { getCurrentUser } from "../services/authService";

const Schedules = () => {
  const [inputs, setInputs] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  const [user, setUser] = useState();
  const [errors, setErrors] = useState({});
  const [isBtnClicked, setIsBtnClicked] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(null);
  const [shouldReload, setShouldReload] = useState(false)

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return <Redirect to="/login" />;
    setUser(user);
  }, user);

  return (
    <React.Fragment>
      <CreateSchedule
        inputs={inputs}
        setInputs={setInputs}
        isBtnClicked={isBtnClicked}
        setIsBtnClicked={setIsBtnClicked}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        errors={errors}
        setErrors={setErrors}
        id={id}
        setShouldReload={setShouldReload}
      />
      <DisplaySchedules
        inputs={inputs}
        setInputs={setInputs}
        isBtnClicked={isBtnClicked}
        setIsBtnClicked={setIsBtnClicked}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        id={id}
        setId={setId}
        shouldReload={shouldReload}
      />
    </React.Fragment>
  );
};

export default Schedules;
