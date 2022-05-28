import React, { useState, useEffect } from "react";
import _ from "lodash";
import {
  getSchedules,
  toggleImportant,
  toggleCompleted,
  deleteSchedule,
} from "../services/scheduleService";
import ScheduleTable from "./scheduleTable";
import Filters from "./filters";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import { dataMapToView } from "../utils/dataMapToView";
import Search from "./search";
import SearchDate from "./searchDate";

const DisplaySchedules = ({
  setInputs,
  setIsBtnClicked,
  setIsEditing,
  setId,
  shouldReload
}) => {
  const [schedules, setSchedules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState({
    path: "title",
    order: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [changeComplete, setChangeComplete] = useState(false);
  const [searchByDate, setSearchByDate] = useState(false);
  const [searchSchedules, setSearchSchedules] = useState(true);

  const pageSize = 5;

  const filtersToApply = [
    "All Schedules",
    "Important",
    "Not Important",
    "Completed",
    "Not Completed",
  ];

  const [selectedFilter, setSelectedFilter] = useState(filtersToApply[0]);

  const toggleSearch = () => {
    if (searchByDate) {
      setSearchByDate(false);
      setSearchSchedules(true);
    } else if (!searchByDate) {
      setSearchByDate(true);
      setSearchSchedules(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedFilter(filtersToApply[0]);
    setCurrentPage(1);
  };
  
  const callGetSchedules = async () => {
    const { data: schedules } = await getSchedules();
    setSchedules(schedules.user);
  };

  useEffect(() => {
    callGetSchedules();
  }, [shouldReload]);

  const handleImportant = async (scheduleId) => {
    // console.log(schedule)
    // const schedulesClone = [...schedules];
    // const index = schedulesClone.indexOf(schedule);
    // schedulesClone[index] = { ...schedules[index] };
    // schedulesClone[index].starred = !schedulesClone[index].starred;

    // setSchedules(schedulesClone);
    const schedulesClone = [...schedules];
    const schedule = schedulesClone.filter((s) => s._id === scheduleId);
    schedule[0].isImportant = !schedule[0].isImportant;
    setSchedules(schedulesClone);

    console.log(schedule[0].isImportant);

    try {
      await toggleImportant(schedule[0]._id, schedule[0].isImportant);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleSort = (sortColumn) => {
    // console.log(path)

    setSortColumn(sortColumn);
  };

  const handleFilterSelect = (filter) => {
    // console.log(filter)
    setSelectedFilter(filter);
    setSearchQuery("");
  };

  const handleComplete = async (id) => {
    // console.log(id)
    const schedulesClone = [...schedules];
    const schedule = schedulesClone.filter((s) => s._id === id);
    // console.log(schedule)
    schedule[0].isCompleted = !schedule[0].isCompleted;
    setSchedules(schedulesClone);
    if (schedule[0].isCompleted) {
      setChangeComplete(true);
    } else {
      setChangeComplete(false);
    }

    try {
      await toggleCompleted(schedule[0]._id, schedule.isCompleted);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleEdit = async (id) => {
    setIsEditing(true);
    const scheduleToBeEdited = schedules.filter(
      (schedule) => schedule._id === id
    );
    setIsBtnClicked(false);
    setId(id);
    // console.log(dataMapToView(scheduleToBeEdited[0]));
    setInputs(dataMapToView(scheduleToBeEdited[0]));
  };

  const handleDelete = async (id) => {
    const allSchedules = schedules;
    const remainingSchedules = allSchedules.filter(
      (schedule) => schedule._id !== id
    );
    setSchedules(remainingSchedules);

    try {
      await deleteSchedule(id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        alert("This movie already has been deleted");
      }
      setSchedules(allSchedules);
    }
  };

  const handlePageChange = (page) => {
    // console.log(page);
    setCurrentPage(page);
  };

  const handlePrevPageChange = (currentPage) => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPageChange = (currentPage) => {
    setCurrentPage(currentPage + 1);
  };

  const implementFilter = (schedules) => {
    let filteredSchedules;
    if (selectedFilter === "Important") {
      filteredSchedules = schedules.filter((schedule) => schedule.isImportant);
    } else if (selectedFilter === "Not Important") {
      filteredSchedules = schedules.filter(
        (schedule) => schedule.isImportant === false
      );
    } else if (selectedFilter === "Completed") {
      filteredSchedules = schedules.filter((schedule) => schedule.isCompleted);
    } else if (selectedFilter === "Not Completed") {
      filteredSchedules = schedules.filter(
        (schedule) => schedule.isCompleted === false
      );
    } else {
      return schedules;
    }
    return filteredSchedules;
  };

  if (schedules.length === 0)
    return <h1 className="text-center mt-4">There are no schedules to show</h1>;

  // const filteredSchedules =
  //   selectedFilter !== "All Schedules"
  //     ? schedules.filter((f) => f === selectedFilter)
  //     : schedules;

  let filteredSchedules = schedules;

  if (searchQuery) {
    filteredSchedules = schedules.filter((schedule) =>
      schedule.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else {
    filteredSchedules = implementFilter(schedules);
  }

  const sortedSchedules = _.orderBy(
    filteredSchedules,
    [sortColumn.path],
    [sortColumn.order]
  );

  const count = sortedSchedules.length;
  const pagedSchedules = paginate(sortedSchedules, currentPage, pageSize);

  return (
    <div className="container mt-4">
      {!searchByDate && (
        <Search
          onSearch={handleSearch}
          toggleSearch={toggleSearch}
          value={searchQuery}
        />
      )}
      {searchByDate && (
        <SearchDate toggleSearch={toggleSearch} schedules={schedules} />
      )}
      <Filters
        filters={filtersToApply}
        onFilterSelect={handleFilterSelect}
        selectedFilter={selectedFilter}
      />
      <ScheduleTable
        pagedSchedules={pagedSchedules}
        handleImportant={handleImportant}
        sortColumn={sortColumn}
        onSort={handleSort}
        onEdit={handleEdit}
        onComplete={handleComplete}
        changeComplete={changeComplete}
        onDelete={handleDelete}
      />
      <Pagination
        currentPage={currentPage}
        itemsCount={count}
        pageSize={pageSize}
        onPrevPageChange={handlePrevPageChange}
        onPageChange={handlePageChange}
        onNextPageChange={handleNextPageChange}
      />
    </div>
  );
};

export default DisplaySchedules;