import http from "./httpService";

export const getSchedules = async () => {
  // console.log(user)
  return await http.get(`schedules`, { withCredentials: true });
};

export const submitSchedule = async (inputs) => {
  return await http.post(`schedule/add`, inputs, { withCredentials: true });
};

export const updateSchedule = async (newData, id) => {
  await http.put(`schedule/${id}`, newData, { withCredentials: true });
};

export const toggleImportant = async (id, toggleValue) => {
  await http.put(`toggleimportant/${id}`, toggleValue, {
    withCredentials: true,
  });
};

export const toggleCompleted = async (id, toggleValue) => {
  await http.put(`togglecompleted/${id}`, toggleValue, {
    withCredentials: true,
  });
};

export const deleteSchedule = async (id) => {
  return await http.delete(`schedule/${id}`, { withCredentials: true });
};