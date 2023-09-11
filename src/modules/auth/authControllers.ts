import dotenv from "dotenv";
import { Request, Response } from "express";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import { AuthUtils } from "./authUtils";
import jwt from "jsonwebtoken";
import { Utils } from "../../helpers/utils";
import OrganizationEmployee from "../../models/orgEmp";

dotenv.config();
export class AuthController {
  private authUtils: AuthUtils = new AuthUtils();

  public login = async (req: Request, res: Response) => {
    const result = await this.authUtils.empLogin(req);
    const response = ResponseBuilder.newMessage(
      result.code,
      result.message,
      result.data
    );
    return res.status(response.code).json(response);
  };

  public forgetPassword = async (req: Request, res: Response) => {
    const result = await this.authUtils.forgetPasswordEmail(req, res);
    if (result.code === 400) {
      const response = ResponseBuilder.badRequest(req.t("USER_NOT_FOUND"));
      return res.status(response.code).json(response);
    } else {
      const token = jwt.sign(
        {
          empId: result.empId,
          empRole: result.empRole,
          id: result.id,
          empName: result.fullName,
          exp: Date.now() + 3600 * 1000,
        },
        `${process.env.JWT_SECRET}` as string
      );
      await OrganizationEmployee.update(
        { resetToken: token },
        { where: { id: result.id } }
      );
      const emailOptions = {
        to: req.body.email,
        subject: "Reset Password for the Subscription Portal",
        template: "forgetPasswordEmail",
        context: {
          '{name}': result?.fullName,
          '{resetPasswordLink}': `https://subscription.solutionanalysts.us/reset-password?token=${token}`,
        },
      };
      Utils.emailSend(emailOptions);
      const response = ResponseBuilder.data(result, req.t("MAIL_SENT_SUCCESS"));
      return res.status(response.code).json(response);
    }
  };

  public changePassword = async (req: any, res: Response) => {
    const result = await this.authUtils.changePasswordUtil(req);
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(result, req.t("CHANGE_PASSWORD"));
      return res.status(response.code).json(response);
    }
  };

  public resetPassword = async (req: any, res: Response) => {
    const id = req?.authUser?.id;
    const { password, confirmPassword } = req.body;
    const result = await this.authUtils.resetPassword(
      id,
      password,
      confirmPassword
    );
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(result, req.t("RESET_PASSWORD"));
      return res.status(response.code).json(response);
    }
  };
}
