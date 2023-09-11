import dotenv from "dotenv";
import Service from "../../models/service";
import Dates from "../../models/dates";
import { Op } from "sequelize";
import { ResponseBuilder } from "../../helpers/responseBuilder";
dotenv.config();

export class ServiceMiddleware {
  public async checkDuplcateService(req, res, next) {
    const data = req?.body;
    const duplicate = await Dates.findOne({
      where: {
        [Op.and]: [
          {
            empId: data.empId,
          },
          {
            [Op.and]: [
              { rmStatus: { [Op.ne]: "Rejected" } },
              { adminStatus: { [Op.ne]: "Cancelled" } },
            ],
          },
        ],
      },
      include: [
        {
          model: Service,
          as: "service",
          where: {
            link: data?.link,
          },
        },
      ],
    });
    if (duplicate) {
      const response = ResponseBuilder.badRequest(
        req.t("ALREADY_EXISTS_REQUEST")
      );
      return res.status(response.code).json(response);
    } else {
      next();
    }
  }

  public async checkDuplcateServiceForRenewal(req, res, next) {
    const duplicate = await Dates.findOne({
      where: {
        [Op.and]: [
          { serviceId: req.body.serviceId },
          { rmStatus: "Requested" },
        ],
      },
    });
    if (duplicate) {
      const response = ResponseBuilder.badRequest(
        req.t("ALREADY_EXISTS_REQUEST")
      );
      return res.status(response.code).json(response);
    } else {
      next();
    }
  }
}
