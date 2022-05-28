import React from "react";
import Star from "./common/star";
import IsCompleted from "./isCompleted";
import TableBody from "./common/tableBody";
import TableHeader from "./common/tableHeader";

const ScheduleTable = ({
  pagedSchedules: schedules,
  handleImportant,
  sortColumn,
  onSort,
  onEdit,
  onComplete,
  changeComplete,
  onDelete,
}) => {
  const columns = [
    {
      key: "important",
      content: (schedule) => (
        <Star onStar={handleImportant} schedule={schedule} />
      ),
    },
    { path: "title", label: "Title" },
    { path: "startDate", label: "Start Date" },
    { path: "startTime", label: "Start Time" },
    { path: "endDate", label: "End Date" },
    { path: "endTime", label: "End Time" },
    {
      key: "isCompeleted",
      content: (schedule) => (
        <IsCompleted
          schedule={schedule}
          onComplete={onComplete}
          changeComplete={changeComplete}
        />
      ),
    },
    {
      key: "edit",
      content: (schedule) => (
        <i
          className="fa fa-pencil"
          style={{ cursor: "pointer", color: "grey" }}
          onClick={() => onEdit(schedule._id)}
        ></i>
      ),
    },
    {
      key: "delete",
      content: (schedule) => (
        <i
          className="fa fa-ban"
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => onDelete(schedule._id)}
        ></i>
      ),
    },
  ];

  return (
    <table className="table table-dark table-hover mt-4">
      <TableHeader columns={columns} onSort={onSort} sortColumn={sortColumn} />
      <TableBody data={schedules} columns={columns} />
    </table>
  );
};

export default ScheduleTable;