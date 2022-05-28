import React from "react";
import moment from "moment";

const IsCompleted = ({ schedule, onComplete, changeComplete }) => {
  const { startDate, startTime, endDate, endTime } = schedule;

  const disabledCompleted = (startDate, startTime, endDate, endTime) => {
    const currentDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm");

    if (startDate > currentDate) return true;

    if (startDate === currentDate) {
      if (startTime > currentTime) return true;
    }

    if (endDate < currentDate) return true;
    if (endDate === currentDate) {
      if (endTime < currentTime) return true;
    }

    return false;
  };

  const disabledOrNot = disabledCompleted(
    startDate,
    startTime,
    endDate,
    endTime
  );

  return (
    <React.Fragment>
      {schedule.isCompleted && !disabledOrNot && (
        <i
          className="fa fa-user-check"
          style={{ cursor: "pointer", color: "green" }}
          onClick={() => onComplete(schedule._id)}
        ></i>
      )}
      {schedule.isCompleted && disabledOrNot && (
        <i
          className="fa fa-user-check"
          style={{ color: "green" }}
          // onClick={() => onComplete(schedule._id)}
        ></i>
      )}
      {!schedule.isCompleted && !disabledOrNot && (
        <i
          className="fa fa-user-check"
          style={{ cursor: "pointer" }}
          onClick={() => onComplete(schedule._id)}
        ></i>
      )}
      {!schedule.isCompleted && disabledOrNot && (
        <i
          className="fa fa-stopwatch"
          style={{ color: "red" }}
          // onClick={() => onComplete(schedule._id)}
        ></i>
      )}
    </React.Fragment>
  );
};

export default IsCompleted;