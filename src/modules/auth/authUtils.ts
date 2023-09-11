import OrganizationEmployee from "../../models/orgEmp";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import dotenv from "dotenv";
import { Constants } from "../../config/constants";
dotenv.config();

export class AuthUtils {
  public empLogin = async (req) => {
    const { email, password } = req.body;
    const user = await OrganizationEmployee.findOne({
      where: { email: email },
    });

    if (!user) {
      return {
        code: Constants.FAIL_CODE,
        message: req.t("USER_NOT_FOUND"),
      };
    }

    if (user?.companyName !== "" && !user?.isVerified) {
      return {
        code: Constants.UNAUTHORIZED_CODE,
        message: req.t("EMAIL_NOT_VERIFY"),
      };
    }

    const ispasswordMatch = await bcrypt.compare(password, user?.password);
    if (ispasswordMatch) {
      const token = jwt.sign(
        {
          email: user.email,
          empId: +user.empId,
          empRole: user.empRole,
          id: user.id,
          fullName: user.fullName,
          isVerified: user.isVerified,
          empManagerId: +user.empManagerId,
          isMasterAdmin: user.isMasterAdmin,
          isFirstLogin: user.isFirstLogin,
        },
        `${process.env.JWT_SECRET}`
      );
      await OrganizationEmployee.update(
        { resetToken: token },
        { where: { id: user.id } }
      );
      return {
        data: { token, ...user?.dataValues },
        code: Constants.SUCCESS_CODE,
        message: req.t("LOGIN_SUCCESS"),
      };
    } else {
      return {
        code: Constants.FAIL_CODE,
        message: req.t("PASSWORD_MISMATCH"),
      };
    }
  };

  public forgetPasswordEmail = async (req, res) => {
    const user = await OrganizationEmployee.findOne({
      where: { email: req.body.email },
    });

    if (user) {
      return user;
    } else {
      return { code: 400, message: req.t("USER_NOT_FOUND") };
    }
  };

  public changePasswordUtil = async (req: any) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = await OrganizationEmployee.findOne({
      where: { id: req?.authUser?.id },
    });
    const oldPassword = user.password;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      const response = ResponseBuilder.badRequest(req.t("PASSWORD_REQUIRED"));
      return response;
    }

    const ispasswordMatch = await bcrypt.compare(currentPassword, oldPassword);
    if (!ispasswordMatch) {
      return ResponseBuilder.badRequest(req.t("CURRENT_PASS_NOT_MATCH"));
    }

    if (newPassword !== confirmNewPassword) {
      const response = ResponseBuilder.badRequest(req.t("PASSWORD_MISMATCH"));
      return response;
    }
    if (currentPassword === newPassword) {
      const response = ResponseBuilder.badRequest(
        req.t("CAN_NOT_SET_SAME_PASSWORD")
      );
      return response;
    }

    const newHashPassword = await bcrypt.hash(newPassword, 10);
    const changePassword = await OrganizationEmployee.update(
      { password: newHashPassword, isFirstLogin: false },
      { where: { id: req?.authUser?.id, password: oldPassword } }
    );

    return changePassword;
  };

  public resetPassword = async (
    id: number,
    password: any,
    confirmPassword: any
  ) => {
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        const response = ResponseBuilder.badRequest(
          `password and confirm password not match `
        );
        return response;
      }
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);
      const changePassword = await OrganizationEmployee.update(
        { password: newHashPassword, resetToken: null },
        { where: { id: id } }
      );
      return changePassword;
    } else {
      const response = ResponseBuilder.badRequest(
        `Please enter password and confirm password`
      );
      return response;
    }
  };
}
