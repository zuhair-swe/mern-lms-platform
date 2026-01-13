
const cron = require("node-cron");
const Student = require("../models/studentSchema");

cron.schedule("* * * * * *", async () => {
  try {
    const now = new Date();

    const result = await Student.deleteMany({
      pendingDelete: true,
      deleteAfter: {$lte: now},
    });

    if (result.deletedCount > 0) {
      console.log(`Cron deleted ${result.deletedCount} students`);
    }
  } catch (error) {
    console.error("Cron delete error:", error.message);
  }
});
