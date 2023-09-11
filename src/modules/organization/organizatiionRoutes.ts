import { Router } from "express";
import { Validator } from "../../validate";
import { OrganizationController } from "./organizationController";
import { OrganizationMiddleware } from "./organizationMiddleware";

// Assign router to the express.Router() instance
const router: Router = Router();

const v: Validator = new Validator();
const organizationController = new OrganizationController();
const organizationMiddleware = new OrganizationMiddleware();

// Get All isManager
router.get("/isManager", organizationController.getAllisManager);

// Get All Employee Department
router.get("/department", organizationController.getAllEmpDepartment);

// Get All Employee Designation
router.get("/designation", organizationController.getAllEmpDesignation);

// get organization employee list
router.get("/", organizationController.getAllEmployee);

// get organization employee list
router.get("/:id", organizationController.getEmployee);

// create employee or organization
router.post(
  "/create",
  organizationMiddleware.checkDuplcateEmployee,
  organizationController.createOrgEmployee
);

// confirm sign up verification 
router.put("/verify/:id", organizationController.verifySignUp);

// Add Employee designation
router.post("/addDesignation", organizationController.createEmpDesignation);

// Add Employee Department
router.post("/addDepartment", organizationController.createEmpDepartment);

// delete organization employee list
router.delete("/delete/:id", organizationController.deleteOrgEmployee);

// update organization employee list
router.put("/update/:id", organizationController.updateOrgEmployee);

export const OrganizationRoute: Router = router;
