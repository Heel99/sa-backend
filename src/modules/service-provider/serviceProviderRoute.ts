import { Router } from "express";
import { Validator } from "../../validate";
import { ServiceProviderController } from "./serviceProviderController";
import { ServiceProviderModel } from "../service-provider/serviceProviderModel"

// Assign router to the express.Router() instance
const router: Router = Router();

const v: Validator = new Validator();
const serviceProviderController = new ServiceProviderController();

router.post("/", v.validate(ServiceProviderModel), serviceProviderController.createServiceProvider);
router.get("/", serviceProviderController.getAllServiceProvider);
router.get("/get/:id", serviceProviderController.getServiceProviderById);
router.put("/update/:id", serviceProviderController.updateServiceProviderById);
router.delete("/delete/:id", serviceProviderController.deleteServiceProviderById);

export const ServiceProviderRoute: Router = router;
