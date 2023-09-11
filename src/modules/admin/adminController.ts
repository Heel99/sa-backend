import { AdminUtils } from "./adminUtils";
import { Request, Response } from "express";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import { Utils } from "../../helpers/utils";
import moment from "moment";
import { Constants } from "../../config/constants";
import Dates from "../../models/dates";
import Service from "../../models/service";
import Purchase from "../../models/purchase";
import OrganizationEmployee from "../../models/orgEmp";
export class AdminController {
  private adminUtils: AdminUtils = new AdminUtils();

  public getAllServices = async (req: Request, res: Response) => {
    const result = await this.adminUtils.getServices();
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("GET_SERVICES_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public getReportServices = async (req: Request, res: Response) => {
    const result = await this.adminUtils.reportServices();
    if (result?.code === 400) {
      return res.status(result?.code).json(result);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("GET_SERVICES_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public updateAdminStatus = async (req: Request, res: Response) => {
    const details = await Dates.findOne({
      where: { id: req.params.dateId },
      include: [
        { model: Service, as: "service" },
        { model: Purchase, as: "purchase" },
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
    if (req.body.status === "Purchased") {
      const result = await this.adminUtils.adminPurchase(
        req,
        req.params.dateId,
        req.body
      );
      if (result.code === 400) {
        return res.status(result.code).json(result);
      } else {
        const empEmailOptions = {
          to: details.user.email,
          template:
            req.query.isRenew === "true"
              ? "adminRenewPurchaseToEmp"
              : "adminPurchaseToEmp",
          subject:
            req.query.isRenew === "true"
              ? `Confirming renewal for your subscription of ${details.service.name}`
              : `Confirming your subscription of ${details.service.name}`,
          context: {
            '{empName}': details.user.fullName,
            '{serviceName}': details.service.name,
            '{serviceName1}': details.service.name,
            '{serviceProvider}': details.service.provider,
            '{serviceType}': details.service.type,
            '{validateDate}': req.body.validateDate
              ? moment(req.body.validateDate).format(Constants.DATE_FORMAT)
              : "Life Time",
          },
        };
        Utils.emailSend(empEmailOptions);
        const response = ResponseBuilder.data(
          result,
          req.t("SUCCESS_PURCHASE_STATUS_PURCHASE")
        );
        return res.status(response.code).json(response);
      }
    } else {
      const result = await this.adminUtils.adminHoldCancel(
        req.params.dateId,
        req.body
      );
      if (result.code === 400) {
        return res.status(result.code).json(result);
      } else {
        let templateForEmp;
        let subjectForEmp;
        if (req.query.isRenew === "true") {
          templateForEmp =
            req.body.status === "Hold"
              ? "adminRenewHoldToEmp"
              : "adminRenewCancelToEmp";
          subjectForEmp =
            req.body.status === "Hold"
              ? `Hold on your renewal of ${details.service.name} subscription purchase request`
              : `${details.service.name} Renew purchase Cancellation`;
        } else {
          templateForEmp =
            req.body.status === "Hold" ? "adminHoldToEmp" : "adminCancelToEmp";
          subjectForEmp =
            req.body.status === "Hold"
              ? `Hold on your ${details.service.name} subscription purchase request`
              : `${details.service.name} Purchase Cancellation`;
        }
        const empEmailOptions = {
          to: details.user.email,
          template: templateForEmp,
          subject: subjectForEmp,
          context: {
            '{empName}': details.user.fullName,
            '{serviceName}': details.service.name,
            '{serviceName1}': details.service.name,
            '{serviceProvider}': details.service.provider,
            '{remark}': req.body.remark,
          },
        };
        Utils.emailSend(empEmailOptions);
        const response = ResponseBuilder.data(
          result,
          req.t(
            `${
              req.body.status === "Hold"
                ? "SUCCESS_PURCHASE_STATUS_HOLD"
                : "SUCCESS_PURCHASE_STATUS_CANCEL"
            }`
          )
        );
        return res.status(response.code).json(response);
      }
    }
  };

  public getExpiryServices = async (req: Request, res: Response) => {
    const result = await this.adminUtils.expiryService();
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("GET_SERVICES_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public cancelSubByAdmin = async (req: Request, res: Response) => {
    const result = await this.adminUtils.cancelByAdmin(req.params.purchaseId);
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(result, req.t("CANCEL_BY_ADMIN"));
      return res.status(response.code).json(response);
    }
  };
}
