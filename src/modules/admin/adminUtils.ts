import { ResponseBuilder } from "../../helpers/responseBuilder";
import { Op, Sequelize } from "sequelize";
import moment from "moment";
import Service from "../../models/service";
import Dates from "../../models/dates";
import Purchase from "../../models/purchase";
import { Constants } from "../../config/constants";
import OrganizationEmployee from "../../models/orgEmp";

export class AdminUtils {
  public getServices = async () => {
    const services = await Dates.findAll({
      where: {
        rmStatus: "Approved",
      },
      order: [["id", "DESC"]],
      include: [
        {
          model: Service,
          as: "service",
        },
        {
          model: OrganizationEmployee,
          as: "user",
          attributes: [
            "email",
            "fullName",
            "empId",
            "empManagerId",
            "empManager",
          ],
        },
        {
          model: Purchase,
          as: "purchase",
        },
      ],
    });
    return services;
  };

  public reportServices = async () => {
    const service = await Dates.findAll({
      where: {
        [Op.or]: [
          { rmStatus: "Rejected" },
          { adminStatus: "Purchased" },
          { adminStatus: "Cancelled" },
        ],
      },
      order: [["id", "DESC"]],
      include: [
        {
          model: Service,
          as: "service",
        },
        {
          model: Purchase,
          as: "purchase",
        },
        {
          model: OrganizationEmployee,
          as: "user",
          attributes: [
            "email",
            "fullName",
            "empId",
            "empManagerId",
            "empManager",
          ],
        },
      ],
    });
    return service;
  };

  public expiryService = async () => {
    return await Dates.findAll({
      include: [
        {
          model: Service,
          as: "service",
        },
        {
          model: OrganizationEmployee,
          as: "user",
          attributes: [
            "email",
            "fullName",
            "empId",
            "empManagerId",
            "empManager",
          ],
        },
        {
          model: Purchase,
          as: "purchase",
          where: {
            [Op.and]: [
              {
                [Op.and]: Sequelize.literal(
                  `validateDate BETWEEN curdate() AND date_add(curdate(), interval 10 DAY)`
                ),
              },
              {
                isExpired: false,
              },
            ],
          },
        },
      ],
    });
  };

  public adminPurchase = async (req, id, body) => {
    const queryRes = await Dates.update(
      {
        adminDate: moment().format(Constants.DATE_STORE_FORMAT),
        adminStatus: body.status,
        adminRemark: body.remark,
      },
      { where: { id: id } }
    );
    if (queryRes) {
      const data = {
        dateId: id,
        purchaseDate: moment().format(Constants.DATE_STORE_FORMAT),
        purchaseEmail: body.purchaseEmail,
        purchasePrice: body.purchasePrice,
        paymentMethod: body.paymentMethod,
        validateDate: body.validateDate,
      };
      await Purchase.create(data);
      return queryRes;
    } else {
      const response = ResponseBuilder.errorMessage(
        req.t("ERR_INTERNAL_SERVER")
      );
      return response;
    }
  };

  public adminHoldCancel = async (id, body) => {
    return await Dates.update(
      {
        adminDate: moment().format(Constants.DATE_STORE_FORMAT),
        adminStatus: body.status,
        adminRemark: body.remark,
      },
      { where: { id: id } }
    );
  };

  public cancelByAdmin = async (id) => {
    return await Purchase.update(
      { isExpired: true },
      {
        where: {
          id: id,
        },
      }
    );
  };
}
