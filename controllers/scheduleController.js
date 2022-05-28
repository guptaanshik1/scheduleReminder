const Schedule = require("../models/schedule");
const BigPromise = require("../middlewares/bigPromise");
const WhereClause = require("../utils/whereClause");
const emailHelper = require("../utils/emailHelper");

const moment = require("moment");
const cron = require("node-cron");

let startTask, endTask;

exports.addSchedule = BigPromise(async (req, res, next) => {
  const { title, startDate, startTime, endDate, endTime } = req.body;

  if (!title || !startDate || !startTime || !endDate || !endTime) {
    return res.status(400).send("All fields are required.");
  }

  if (!moment(startDate).isValid() || !moment(endDate).isValid()) {
    return res.status(400).send("The dates are invalid.");
  }
  req.body.user = req.user.id; // adding logged in user to request body

  if (!req.body.user) {
    return res.status(400).send("Login to access this resource.");
  }

  const schedule = await Schedule.create(req.body);

  const email = req.user.email;
  // YYYY - MM - DD HH:MM
  const startMin = startTime.split(":")[1];
  const startHr = startTime.split(":")[0];
  const startDay = startDate.split("-")[2];
  const startMonth = startDate.split("-")[1];

  const endMin = endTime.split(":")[1];
  const endHr = endTime.split(":")[0];
  const endDay = endDate.split("-")[2];
  const endMonth = endDate.split("-")[1];

  startTask = cron.schedule(
    `${startMin} ${startHr} ${startDay} ${startMonth} *`,
    async () => {
      // console.log("startMin: " + startMin);
      // console.log("startHr: " + startHr);
      // console.log("startDate: " + startDay);
      // console.log("startMonth: " + startMonth);
      try {
        await emailHelper({
          email,
          subject: "Reminder Email",
          message: `Your task ${title} is scheduled to start now make sure to complete it.`,
        });
      } catch (error) {
        return res.status(403).send("Reminder email cannot be sent");
      }
    }
  );

  endTask = cron.schedule(
    `${endMin} ${endHr} ${endDay} ${endMonth} *`,
    async () => {
      // console.log("endMin: " + endMin);
      // console.log("endHr: " + endHr);
      // console.log("endDate: " + endDay);
      // console.log("endMonth: " + endMonth);
      try {
        await emailHelper({
          email,
          subject: "Reminder Email",
          message: `Your task ${title} has ended now`,
        });
      } catch (error) {
        return res.status(403).send("Reminder email cannot be sent");
      }
    }
  );

  res.status(200).json({
    success: true,
    schedule,
  });
});

exports.getOneUserSchedules = BigPromise(async (req, res, next) => {
  const user = await Schedule.find({ user: req.user.id });

  if (!user) {
    return res.status(400).send("User does not exist.");
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// const resultPerPage = 4;
// const totalSchedulesCount = await Schedule.countDocuments();

// const schedulesObj = new WhereClause(Schedule.find(), req.query)
//   .search()
//   .filter();

// let schedules = await schedulesObj.base; // this will give Schedule.find()
// const filteredSchedulesCount = schedules.length;

// schedulesObj.pager(resultPerPage);
// schedules = await schedulesObj.base.clone();

// res.status(200).json({
//   success: true,
//   schedules,
//   totalSchedulesCount,
//   filteredSchedulesCount,
// });

exports.toggleImportant = BigPromise(async (req, res, next) => {
  let schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    return res.status(400).send("This schedule does not exist.");
  }
  const { isImportant } = schedule;

  const updatedImportant = schedule.changeImportantValue();

  const dataToBeChanged = {
    isImportant: updatedImportant,
  };

  schedule = await Schedule.findByIdAndUpdate(req.params.id, dataToBeChanged, {
    new: true,
    runValidators: false,
    findAndModify: false,
  });

  res.status(200).json({
    success: true,
    schedule,
  });
});

exports.toggleCompleted = BigPromise(async (req, res, next) => {
  let schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    return res.status(400).send("This schedule does not exist.");
  }
  const { isCompleted } = schedule;

  const updatedCompleted = schedule.changeCompletedValue();

  const dataToBeChanged = {
    isCompleted: updatedCompleted,
  };

  schedule = await Schedule.findByIdAndUpdate(req.params.id, dataToBeChanged, {
    new: true,
    runValidators: false,
    findAndModify: false,
  });

  res.status(200).json({
    success: true,
    schedule,
  });
});

exports.getOneUserOneSchedule = BigPromise(async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    return res.status(400).send("This schedule does not exist.");
  }

  res.json({
    success: true,
    schedule,
  });
});

exports.updateOneSchedule = BigPromise(async (req, res, next) => {
  let schedule = await Schedule.findById(req.params.id);
  const email = req.user.email;

  if (!schedule) {
    return res.status(400).send("This schedule does not exist.");
  }

  const { title, startDate, endDate, startTime, endTime, isCompleted } =
    req.body;

  const newData = {
    title,
    startDate,
    endDate,
    startTime,
    endTime,
  };

  if (!moment(startDate).isValid() || !moment(endDate).isValid()) {
    return res.status(400).send("The dates are invalid.");
  }

  if (schedule.isStartDateTimeChanged && startTask) {
    startTask.stop();

    const startMin = startTime.split(":")[1];
    const startHr = startTime.split(":")[0];
    const startDay = startDate.split("-")[2];
    const startMonth = startDate.split("-")[1];

    startTask = cron.schedule(
      `${startMin} ${startHr} ${startDay} ${startMonth} *`,
      async () => {
        try {
          await emailHelper({
            email,
            subject: "Reminder Email",
            message: `Your task ${title} is scheduled to start now make sure to complete it.`,
          });
        } catch (error) {
          return res.status(400).send(error);
        }
      }
    );
  }

  if (schedule.isEndDateTimeChanged && endTask) {
    endTask.stop();

    const endMin = endTime.split(":")[1];
    const endHr = endTime.split(":")[0];
    const endDay = endDate.split("-")[2];
    const endMonth = endDate.split("-")[1];

    endTask = cron.schedule(
      `${endMin} ${endHr} ${endDay} ${endMonth} *`,
      async () => {
        try {
          await emailHelper({
            email,
            subject: "Reminder Email",
            message: `Your task ${title} has ended now`,
          });
        } catch (error) {
          return res.status(400).send(error);
        }
      }
    );
  }

  schedule = await Schedule.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    findAndModify: false,
  });

  res.status(200).json({
    success: true,
    schedule,
  });
});

exports.deleteOneSchedule = BigPromise(async (req, res, next) => {
  let schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    return res.status(400).send("This schedule does not exist.");
  }

  if (startTask) startTask.stop();
  if (endTask) endTask.stop();

  await schedule.remove();

  res.status(200).json({
    success: true,
    message: "The schedule has been deleted",
  });
});

exports.adminGetOneUserSchedules = BigPromise(async (req, res, next) => {
  const user = await Schedule.find({ user: req.params.id });

  if (!user) {
    return res.status(400).send("This user does not exist.");
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminGetOneSchedule = BigPromise(async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    return res.status(400).send("This schedule does not exist.");
  }

  res.status(200).json({
    success: true,
    schedule,
  });
});

exports.adminDeleteOneSchedule = BigPromise(async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    return res.status(400).send("This schedule does not exist.");
  }

  await schedule.remove();

  res.status(200).json({
    success: true,
    message: "This schedule has been deleted",
  });
});