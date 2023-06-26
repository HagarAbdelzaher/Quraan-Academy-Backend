const { Session } = require("../models");
const { BaseError } = require("../libs");
const { sortBy } = require("lodash");

const getSessions = async (month, year) => {
  const currentDate = new Date();
  month = month || currentDate.getMonth() + 1;
  year = year || currentDate.getFullYear();
  console.log(year);
  const sessions = await Session.find({
    $expr: {
      $and: [
        { $eq: [{ $month: "$date" }, month] },
        { $eq: [{ $year: "$date" }, year] },
      ],
    },
  })
    .sort({ date: 1, startTime: 1 })
    .exec();
  if (!sessions) {
    throw new BaseError("No Sessions found", 404);
  }
  return sessions;
};

module.exports = {
  getSessions,
};
