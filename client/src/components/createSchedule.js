import React, { useState } from "react";
import Joi from "joi-browser";

import { renderInput, validate, validateProperty } from "./common/formSchedule";

import { submitSchedule, updateSchedule } from "../services/scheduleService";

import {
  isStartDateCorrect,
  isEndDateCorrect,
  isStartTimeCorrect,
  isEndTimeCorrect,
  isTimeCorrectWithDate,
} from "../utils/validateDateTime";

const CreateSchedule = ({
  inputs,
  setInputs,
  isBtnClicked,
  setIsBtnClicked,
  errors,
  setErrors,
  isEditing,
  setIsEditing,
  id,
  setShouldReload
}) => {
  const { title, startDate, startTime, endDate, endTime } = inputs;

  const schema = {
    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    startDate: Joi.string().required().label("Start Date"),
    startTime: Joi.string().required().label("Start Time"),
    endDate: Joi.string().required().label("End Date"),
    endTime: Joi.string().required().label("End Time"),
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    const allErrors = { ...errors };
    const errorMessage = validateProperty(name, value, schema);
    // console.log(errorMessage);
    if (errorMessage) {
      allErrors[name] = errorMessage;
    } else {
      delete allErrors[name];
    }
    // setInputs(prevState => console.log(prevState))
    setErrors(allErrors);
    setInputs((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleClose = () => {
    setIsBtnClicked(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitErrors = validate(inputs, schema);
    setErrors(submitErrors || {});
    if (Object.keys(errors).length > 0) {
      alert("Some data is invalid");
      return;
    }
    // date validations

    // checking for start date
    if (!isStartDateCorrect(startDate, endDate)) {
      alert("Error: Start Date is incorrect");
      return;
    }
    if (!isEndDateCorrect(startDate, endDate)) {
      alert("Error: End Date is incorrect");
      return;
    }
    if (!isTimeCorrectWithDate(startDate, startTime, endDate, endTime)) {
      alert("Error: Timings are not correct");
      return;
    }
    if (!isStartTimeCorrect(startDate, startTime)) {
      alert("Error: Start Time is incorrect");
      return;
    }
    if (!isEndTimeCorrect(endDate, endTime)) {
      alert("Error: End Time is incorrect");
      return;
    }
    doSubmit();

    setIsBtnClicked(true);
  };

  const doSubmit = async () => {
    const updateScheduleId = id;

    if (isEditing) {
      await updateSchedule(inputs, updateScheduleId);
      setIsEditing(false);
    }
    if (!isEditing) {
      await submitSchedule(inputs);
    }

    setShouldReload(true);
    // window.location = "/schedules";

    setInputs({
      title: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    });
  };

  const handleToggleForm = () => {
    setIsBtnClicked(false);
    setIsEditing(false);
  };

  return (
    <form className="container form-group" onSubmit={handleSubmit}>
      {!isBtnClicked && (
        <React.Fragment>
          <div className="row">
            <div className="col text-center">
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {/* {renderTextarea(
                "title",
                "Title",
                title,
                handleInput,
                "title",
                errors
              )} */}
              {renderInput(
                "title",
                "Title",
                "text",
                title,
                handleInput,
                errors
              )}
            </div>
          </div>
          <div className="row">
            <div className="col order-1">
              {renderInput(
                "startDate",
                "Start Date",
                "date",
                startDate,
                handleInput,
                errors
              )}
            </div>
            <div className="col order-1">
              {renderInput(
                "startTime",
                "Start Time",
                "time",
                startTime,
                handleInput,
                errors
              )}
            </div>
            <div className="col order-1">
              {renderInput(
                "endDate",
                "End Date",
                "date",
                endDate,
                handleInput,
                errors
              )}
            </div>
            <div className="col order-1">
              {renderInput(
                "endTime",
                "End Time",
                "time",
                endTime,
                handleInput,
                errors
              )}
            </div>
          </div>
          <div className="row">
            <div className="col text-center mt-4">
              <button style={{ border: "none", backgroundColor: "white" }}>
                <i
                  className="fa fa-check-circle"
                  style={{ fontSize: "48px", color: "blue", pointer: "cursor" }}
                ></i>
              </button>
            </div>
          </div>
        </React.Fragment>
      )}
      {isBtnClicked && (
        <div className="text-center">
          <i
            className="fa fa-plus-circle"
            onClick={handleToggleForm}
            style={{ fontSize: "24px", color: "blue", cursor: "pointer" }}
          ></i>
        </div>
      )}
    </form>
  );
};

export default CreateSchedule;