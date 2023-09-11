import { CronUtils } from "./cronUtils";
import * as cron from "node-cron";

const cronStart = async () => {
  const cronUtils = new CronUtils();
  cron.schedule(
    "0 9 * * *",
    async () => {
      try {
        await cronUtils.getReminderCron();
      } catch (err) {
        console.log("error in running cron", err);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

export default cronStart;
