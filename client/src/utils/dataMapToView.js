export const dataMapToView = (schedule) => {
  return {
    _id: schedule._id,
    title: schedule.title,
    startDate: schedule.startDate,
    startTime: schedule.startTime,
    endDate: schedule.endDate,
    endTime: schedule.endTime,
  };
};