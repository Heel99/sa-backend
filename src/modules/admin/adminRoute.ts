import { Router } from "express";
import { Middleware } from "../../middleware";
import { Validator } from "../../validate";
import { AdminController } from "./adminController";
import { CronUtils } from "../cron/cronUtils";

// Assign router to the express.Router() instance
const router: Router = Router();

const v: Validator = new Validator();
const adminController = new AdminController();
const cronController = new CronUtils()
const middleware = new Middleware();

// get services for admin 
router.get("/", adminController.getAllServices);

// get services for downloading excel report 
router.get("/report", adminController.getReportServices);

// get expiring soon services 
router.get("/expiry", adminController.getExpiryServices);

// admin actions route to update resvices data
router.put("/:dateId",  middleware.getDataFromToken, adminController.updateAdminStatus);

// cancel subscription by admin 
router.put("/cancel/:purchaseId", adminController.cancelSubByAdmin)

//testing cron api just for data fetching purposes
router.get("/cron", cronController.getReminderCron)

export const AdminRoute: Router = router;