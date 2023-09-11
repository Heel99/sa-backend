import Service from "../../models/service";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import moment from "moment";
import Dates from "../../models/dates";
import { Constants } from "../../config/constants";
import Purchase from "../../models/purchase";
import OrganizationEmployee from "../../models/orgEmp";

export class ServiceUtils {
  public async createService(req: any, data: any) {
    const serviceObj = {
      name: data?.name,
      type: data?.type,
      provider: data?.provider,
      link: data?.link,
      price: data?.price,
    };
    const serviceRes = await Service.create(serviceObj);
    if (serviceRes) {
      const datesObject = {
        startDate: data.startDate,
        endDate: data?.endDate ? data?.endDate : null,
        empId: data?.empId,
        rmId: data?.rmId,
        serviceId: serviceRes?.dataValues?.id,
        reason: data?.reason,
      };
      const resObj = await Dates.create(datesObject);
      return resObj;
    } else {
      const response = ResponseBuilder.errorMessage(
        req.t("ERR_INTERNAL_SERVER")
      );
      return response;
    }
  }

  public getServices = async (empId, id, flag) => {
    const query = flag === "true" ? { rmId: empId } : { empId: id }; //change this 167 to id
    const services = await Dates.findAll({
      where: query,
      order: [["updatedAt", "DESC"]],
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
          attributes: ["email", "fullName", "empId", "empManagerId", "empManager"]
        },
      ],
    });
    return services;
  };

  public updateStatus = async (id : any, body : any) => {
    return await Dates.update(
      {
        rmStatus: body.status,
        rmRemark: body.remark,
        approverDate: moment().format(Constants.DATE_STORE_FORMAT),
      },
      {
        where: { id: id },
      }
    );
  };

  public getRenewDetailsById = async (id) => {
    const dates = await Dates.findOne({
      where: {
        serviceId: id,
      },
      order: [["id", "DESC"]],
      limit: 1,
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
          attributes: ["email", "fullName", "empId", "empManagerId", "empManager"]
        },
      ],
    });
    return dates;
  };

  public createRenew = async (req, data, dateId) => {
    const updateDateDetails = await Dates.update(
      { renewByUserAt: moment().format(Constants.DATE_STORE_FORMAT), renewReason: data.reason },
      { where: { id: dateId } }
    );
    if (updateDateDetails) {
      const dateDetails = await Dates.findOne({
        where: { id: dateId },
        include: [
          {
            model: Service,
            as: "service",
          },
          {
            model: OrganizationEmployee,
            as: "user",
            attributes: ["email", "fullName", "empId", "empManagerId", "empManager"]
          },
          {
            model: Purchase,
            as: "purchase",
          },
        ],
      });
      const dataForStore = {
        startDate: dateDetails.purchase.validateDate,
        endDate: data.endDate,
        empId: dateDetails.user.id,
        rmId: dateDetails.user.rmId,
        serviceId: data.serviceId,
        reason: dateDetails.reason,
      };
      const resObj = await Dates.create(dataForStore);
      return resObj;
    } else {
      const response = ResponseBuilder.errorMessage(
        req.t("ERR_INTERNAL_SERVER")
      );
      return response;
    }
  };

  public getServiceDetailsFromId = async (id) => {
    const service = await Service.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Dates,
          as: "date",
          order: [["id", "DESC"]],
          include: [
            {
              model: OrganizationEmployee,
              as: "user",
              attributes: ["email", "fullName", "empId", "empManagerId", "empManager"]
            },
            {
              model: Purchase,
              as: "purchase",
            },
          ],
        },
      ],
    });
    return service;
  };

  public cancelRequestByUser = async (id, body) => {
    return await Dates.update(
      {
        cancelByUserAt: moment().format(Constants.DATE_STORE_FORMAT),
        cancelReason: body?.cancelReason,
      },
      { where: { id: id } }
    );
  };

  public getDateIdDetails = async (id) => {
    return await Dates.findOne({
      where : { id : id},
      include : [
        {
          model : Service,
          as : "service"
        }, 
        {
          model: Purchase,
          as : "purchase"
        }, 
        {
          model : OrganizationEmployee,
          as : 'user',
          attributes: ["email", "fullName", "empId", "empManagerId", "empManager"]
        }
      ]
    })
  }
}
