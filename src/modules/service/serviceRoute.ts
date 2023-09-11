import { Router } from "express";
import { Validator } from "../../validate";
import { ServiceController } from "./serviceController";
import { ServiceModel } from "../service/serviceModel";
import { ServiceMiddleware } from "./serviceMiddleware";
import { Middleware } from "../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();

const v: Validator = new Validator();
const serviceController = new ServiceController();
const serviceMiddeleware = new ServiceMiddleware();
const middleware = new Middleware();

// create service route
router.post(
  "/",
  v.validate(ServiceModel),
  middleware.getDataFromToken,
  serviceMiddeleware.checkDuplcateService,
  serviceController.createService
);

// get specified service for view request page 
router.get("/serviceId/:serviceId", middleware.getDataFromToken, serviceController.getServiceDetailsById)

// get date table data for specific ID
router.get("/dateId/:dateId", middleware.getDataFromToken, serviceController.getServiceDetailsByDateId)

// approver routes
// get services assigned to approver
router.get("/", middleware.getDataFromToken, serviceController.getRequestsById);
//update status as approver's actions 
router.put(
  "/:dateId",
  middleware.getDataFromToken,
  serviceController.updateRmStatus
);




// renewal related routes

// get specific renew service details from all table 
router.get("/renew/:serviceId", serviceController.getRenewServiceById)

// apply for renewal of service
router.put("/renew/:dateId",serviceMiddeleware.checkDuplcateServiceForRenewal, serviceController.createRenewService)

// cancel service API
router.put("/cancel/:dateId", middleware.getDataFromToken, serviceController.cancelService)

export const ServiceRoute: Router = router;
