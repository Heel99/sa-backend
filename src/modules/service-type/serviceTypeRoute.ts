import { Router } from "express";
import { Validator } from "../../validate";
import { ServiceTypeController } from "./serviceTypeController";
import { ServiceTypeModel } from "../service-type/serviceTypeModel"

// Assign router to the express.Router() instance
const router: Router = Router();

const v: Validator = new Validator();
const serviceTypeController = new ServiceTypeController();

router.post("/", v.validate(ServiceTypeModel), serviceTypeController.createServiceType);
router.get("/", serviceTypeController.getAllServiceTypes);

export const ServiceTypeRoute: Router = router;
