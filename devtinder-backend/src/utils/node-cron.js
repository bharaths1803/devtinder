const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const connectionModel = require("../models/connection.model");
const { sendEmail } = require("./email");

cron.schedule("0 8 * * *", async () => {
  const yesterday = subDays(new Date(), 1);
  const yesterdaySt = startOfDay(yesterday);
  const yesterdayEnd = endOfDay(yesterday);
  const existingConnectionRequests = await connectionModel
    .find({
      status: "interested",
      createdAt: {
        $gte: yesterdaySt,
        $lte: yesterdayEnd,
      },
    })
    .populate("toUserId");
  const allEmails = [
    ...new Set(existingConnectionRequests.map((req) => req.toUserId.emailId)),
  ];

  for (const email of allEmails) {
    await sendEmail({
      to: email,
      subject: "New Friend Requests pending for you",
      html: `<h1>There are so many friend requests pending, please login to DevTinder and accept or reject the requests.</h1>`,
    });
  }
});
