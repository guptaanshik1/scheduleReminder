const mongoose = require("mongoose");
const moment = require("moment");
const to = require('time-operations')

const scheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  startDate: {
    type: String,
    required: [true, "Start date is required"],
    validate: function (date) {
      return moment(date).isValid();
    },
  },
  startTime: {
    type: String,
    required: [true, "Start time is required"],
    validate: function (time) {
        return to.checkTimeFormat(time)
    }
  },
  endDate: {
    type: String,
    required: [true, "End Date is required"],
    validate: function (date) {
      return moment(date).isValid();
    },
  },
  endTime: {
    type: String,
    required: [true, "End Time is required"],
    validate: function (time) {
        return to.checkTimeFormat(time)
    }
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isImportant: {
    type: Boolean,
    default: false,
  },
  isAttempted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

scheduleSchema.methods.isStartDateTimeChanged = function () {
  if (this.isModified("startDate") || this.isModified("startTime")) {
    return true;
  } else {
    return false;
  }
};

scheduleSchema.methods.isEndDateTimeChanged = function () {
  if (this.isModified("endDate") || this.isModified("endTime")) {
    return true;
  } else {
    return false;
  }
};

scheduleSchema.methods.changeImportantValue = function () {
  if (this.isImportant) {
    this.isImportant = false;
  } else {
    this.isImportant = true;
  }
  return this.isImportant;
};

scheduleSchema.methods.changeCompletedValue = function () {
  if (this.isCompleted) {
    this.isCompleted = false;
  } else {
    this.isCompleted = true;
  }
  return this.isCompleted;
};

module.exports = mongoose.model("Schedule", scheduleSchema);