import { Router } from "express";
import { Validator } from "../../validate";
import { AuthController } from "./authControllers";
import { AuthMiddleware } from "./authMiddleware";

// Assign router to the express.Router() instance
const router: Router = Router();

const v: Validator = new Validator();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// login api
router.post("/login", authController.login);

// forget password email API
router.post("/forgetPassword", authController.forgetPassword);

// change password API
router.post(
  "/changePassword",
  authMiddleware.checkToken,
  authController.changePassword
);

// reset password email API
router.post(
  "/resetPassword",
  authMiddleware.checkToken,
  authController.resetPassword
);

export const AuthRoute: Router = router;
