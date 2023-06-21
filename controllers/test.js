// function getSundaysAndTuesdays(startDate, endDate) {
//   //get course data // sessionsData //
//   //loop
//   const daysOfWeek = sessionsData.map((session) => session.day);
//   //const daysOfWeek = ["Sunday", "Tuesday"];
//   const result = [];

//   // get all dates of sundays and tuesdays
//   let currentDate = new Date(startDate);
//   while (currentDate <= endDate) {
//     if (
//       daysOfWeek.includes(
//         currentDate.toLocaleDateString("en-US", { weekday: "long" })
//       )
//     ) {
//       result.push(new Date(currentDate));
//     }
//     currentDate.setDate(currentDate.getDate() + 1);
//   }
//   return result;
// }

// function CalculateSessionsData(datesOfSessions) {
//   // get course Data from database // sessionsData //courseId
//   let courseSessions = [];

//   for (let i = 0; i < datesOfSessions.length; i++) {
//     const day = getDayofWeek(datesOfSessions[i]);
//     const currentSession = {
//       date: datesOfSessions[i],
//       courseId,
//     };
//     sessionsData.forEach((session) => {
//       if (session.day === day) {
//         currentSession.startTime = session.startTime;
//         currentSession.endTime = session.endTime;
//       }
//       courseSessions.push(currentSession);
//     });
//     //insert Many for course sessions in database
//   }
// }

// function getDayOfWeek(date) {
//   const daysOfWeek = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   const dayIndex = date.getDay();
//   return daysOfWeek[dayIndex];
// }
