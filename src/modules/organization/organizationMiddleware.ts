import dotenv from "dotenv";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import OrganizationEmployee from "../../models/orgEmp";
import { Op } from "sequelize";
dotenv.config();

export class OrganizationMiddleware {
  public async checkDuplcateEmployee(req, res, next) {
    const duplicate = await OrganizationEmployee.findOne({
      where: {
        [Op.or]: [{ empId: req?.body?.empId }, { email: req?.body?.email }],
      },
    });
    if (duplicate) {
      const response = ResponseBuilder.badRequest(req.t("EMP_ALREADY_EXIST"));
      return res.status(response.code).json(response);
    } else {
      next();
    }
  }
}
