import dotenv from "dotenv";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import OrganizationEmployee from "../../models/orgEmp";
import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Jwt } from "../../helpers/jwt";

dotenv.config();

export class AuthMiddleware {
  public async checkToken(req: any, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : "";
      const tokenDetails = await Jwt.decodeAuthToken(token);
      if (tokenDetails) {
        const verifiedTokenDetails = jwt.verify(
          token ? token : "",
          `${process.env.JWT_SECRET}` as string
        );
        const tokenInDatabase = await OrganizationEmployee.findOne({
          where: { id: verifiedTokenDetails?.id },
        });
        if (tokenInDatabase.resetToken === token) {
          req.authUser = verifiedTokenDetails;
          next();
        } else {
          const response = ResponseBuilder.badRequest(req.t("TOKEN_USED"));
          return res.status(response.code).json(response);
        }
      } else {
        const response = ResponseBuilder.badRequest(req.t("TOKEN_EXPIRED"));
        return res.status(response.code).json(response);
      }
    } catch (error) {
      const response = ResponseBuilder.unauthorizedRequest(
        req.t("TOKEN_EXPIRED")
      );
      return res.status(response.code).json(response);
    }
  }
}
