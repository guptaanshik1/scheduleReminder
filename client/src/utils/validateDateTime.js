import to from "time-operations";
import moment from "moment";

export const isStartDateCorrect = (startDate, endDate) => {
  const currentDate = moment().format("YYYY-MM-DD");
  if (startDate < currentDate) return false;
  else if (startDate > endDate) return false;
  return true;
};

// console.log(isStartDateCorrect(startDate, endDate)) checked

export const isEndDateCorrect = (startDate, endDate) => {
  const currentDate = moment().format("YYYY-MM-DD");
  if (endDate < currentDate) return false;
  else if (endDate < startDate) return false;

  return true;
};

// console.log(isEndDateCorrect(startDate, endDate)) checked

export const isStartTimeCorrect = (startDate, startTime) => {
  if (to.isTimeValid(startDate, startTime)) {
    return true;
  } else {
    return false;
  }
};

// console.log(isStartTimeCorrect(startDate, startTime)) checked

export const isEndTimeCorrect = (endDate, endTime) => {
  console.log(endDate, endTime);
  if (to.isTimeValid(endDate, endTime)) {
    return true;
  } else {
    return false;
  }
};

// console.log(isEndTImeCorrect(endDate, endTime)) checked

export const isTimeCorrectWithDate = (
  startDate,
  startTime,
  endDate,
  endTime
) => {
  if (startDate === endDate) {
    if (startTime >= endTime) {
      return false;
    } else {
      return true;
    }
  }
  return true;
};