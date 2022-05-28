export const checkForImportant = (schedules) => {
  return schedules.filter((schedule) => schedule.isImporant);
};

export const checkForNotImportant = (schedules) => {
  return schedules.filter((schedule) => schedule.isImporant === false);
};

export const checkForCompleted = (schedules) => {
  return schedules.filter((schedule) => schedule.isCompleted);
};

export const checkForNotCompleted = (schedules) => {
  return schedules.filter((schedule) => schedule.isCompleted === false);
};