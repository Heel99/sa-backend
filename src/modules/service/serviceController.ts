import { ServiceUtils } from "./serviceUtils";
import { Request, Response } from "express";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import { Utils } from "../../helpers/utils";
import moment from "moment";
import { Constants } from "../../config/constants";
import Service from "../../models/service";
import Dates from "../../models/dates";
import Purchase from "../../models/purchase";
import OrganizationEmployee from "../../models/orgEmp";
export class ServiceController {
  private serviceUtils: ServiceUtils = new ServiceUtils();

  public createService = async (req: any, res: Response) => {
    const result = await this.serviceUtils.createService(req, req.body);
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const empDetails = await Utils.getDetailsById(req.data.empId);
      const rmDetails = await Utils.getDetailsById(empDetails?.empManagerId);
      const data = req.body;
      let duration: string;
      if (data?.endDate) {
        duration = `${Utils.countDuration(
          moment(req.body.startDate, Constants.DATE_STORE_FORMAT),
          moment(req.body.endDate, Constants.DATE_STORE_FORMAT)
        )} Months `;
      } else {
        duration = `${moment(req.body.startDate).format(
          Constants.DATE_FORMAT
        )} - Life Time`;
      }
      const empEmailOptions = {
        to: rmDetails.email,
        template: "requestToRm",
        subject: `Requesting for ${data.name} subscription`,
        context: {
          '{empName}': empDetails?.fullName,
          '{empName1}': empDetails?.fullName,
          '{serviceName}': data?.name,
          '{serviceName1}': data?.name,
          '{serviceProvider}': data?.provider,
          '{serviceLink}': data?.link,
          '{reason}': data?.reason,
          '{duration}': duration,
          '{link}': `https://subscription.solutionanalysts.us/dashboard/${result?.serviceId}`,
        },
      };
      Utils.emailSend(empEmailOptions);
      const response = ResponseBuilder.data(
        result,
        req.t("SUCCESS_CREATION_REQUEST")
      );
      return res.status(response.code).json(response);
    }
  };

  public getRequestsById = async (req: any, res: Response) => {
    const result = await this.serviceUtils.getServices(
      req.data.empId,
      req.data.id,
      req.query.isApprover
    );
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

  public updateRmStatus = async (req: any, res: Response) => {
    const result = await this.serviceUtils.updateStatus(
      req.params.dateId,
      req.body
    );
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const details = await Dates.findOne({
        where: { id: req.params.dateId },
        include: [
          { model: Service, as: "service" },
          { model: Purchase, as: "purchase" },
          { model: OrganizationEmployee, as: "user" },
        ],
      });
      const duration: string = details.endDate
        ? `${moment(details.startDate).format(
            Constants.DATE_FORMAT
          )} - ${moment(details.endDate).format(
            Constants.DATE_FORMAT
          )} (${Utils.countDuration(
            moment(details.startDate, Constants.DATE_STORE_FORMAT),
            moment(details.endDate, Constants.DATE_STORE_FORMAT)
          )} Months)`
        : `${moment(details.startDate).format(
            Constants.DATE_FORMAT
          )} - Life Time`;

      let templateForEmp;
      let subjectForEmp;
      if (req.query.isRenew === "true") {
        templateForEmp =
          req.body.status === "Approved"
            ? "rmRenewApproveToEmp"
            : "rmRenewRejectToEmp";
        subjectForEmp =
          req.body.status === "Approved"
            ? `Approval of renewal requested ${details.service.name} subscription`
            : `Update on Your Request for ${details.service.name} from ${details.service.provider}`;
      } else {
        templateForEmp =
          req.body.status === "Approved" ? "rmApproveToEmp" : "rmRejectToEmp";
        subjectForEmp =
          req.body.status === "Approved"
            ? `Approval of requested ${details.service.name} subscription`
            : `Update on Your Request for ${details.service.name}`;
      }

      const empEmailOptions = {
        to: details.user.email,
        subject: subjectForEmp,
        template: templateForEmp,
        context: {
          '{empName}': details.user.fullName,
          '{empName1}': details.user.fullName,
          '{serviceName}': details.service.name,
          '{serviceName1}': details.service.name,
          '{rmName}': details.user.empManager,
          '{serviceProvider}': details.service.provider,
          '{remark}': req.body.remark,
        },
      };

      let templateForAdmin;
      let subjectForAdmin;
      if (req.query.isRenew === "true") {
        templateForAdmin =
          req.body.status === "Approved"
            ? "rmRenewApproveToAdmin"
            : "rmRenewRejectToAdmin";
        subjectForAdmin =
          req.body.status === "Approved"
            ? `Approval of requested renewal ${details.service.name} subscription`
            : `Request to cancel the subscription of ${details.user.fullName} for ${details.service.name}`;
      } else {
        templateForAdmin = "rmApproveToAdmin";
        subjectForAdmin = `Request for the purchase of ${details.service.name} subscription`;
      }

      const adminEmailOptions = {
        to: process.env.ACCOUNT_EMAIL,
        subject: subjectForAdmin,
        template: templateForAdmin,
        context: {
          '{expiryDate}':
            req.query.isRenew === "true"
              ? moment(details.startDate).format(Constants.DATE_FORMAT)
              : "",
          '{purchaseEmail}':
            req.query.isRenew === "true"
              ? details?.purchase?.purchaseEmail
              : "",
          '{empName}': details.user.fullName,
          '{rmName}': details.user.empManager,
          '{serviceName}': details.service.name,
          '{serviceName1}': details.service.name,
          '{serviceName2}': details.service.name,
          '{serviceType}': details.service.type,
          '{serviceLink}': details.service.link,
          '{serviceProvider}': details.service.provider,
          '{remark}': req.body.remark,
          '{link}': `https://subscription.solutionanalysts.us/admin/${details?.service?.id}`,
          '{duration}': duration,
          '{price}': details.service.price,
        },
      };

      Utils.emailSend(empEmailOptions);

      let isEmailToAdmin: boolean = true;
      if ((req.query.isRenew === "false" && req.body.status === "Rejected"))
        isEmailToAdmin = false;
      if (isEmailToAdmin) Utils.emailSend(adminEmailOptions);

      const response = ResponseBuilder.data(
        result,
        req.t(
          `${
            req.body.status === "Approved"
              ? "SUCCESS_STATUS_APPROVE"
              : "SUCCESS_STATUS_REJECT"
          }`
        )
      );
      return res.status(response.code).json(response);
    }
  };

  public getRenewServiceById = async (req: Request, res: Response) => {
    const result = await this.serviceUtils.getRenewDetailsById(
      req.params.serviceId
    );
    if (result?.code === 400) {
      return res.status(result?.code).json(result);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("GET_REQUEST_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public createRenewService = async (req: Request, res: Response) => {
    const result = await this.serviceUtils.createRenew(
      req,
      req.body,
      req.params.dateId
    );
    if (result?.code === 400) {
      return res.status(result?.code).json(result);
    } else {
      const details = await Utils.getDetailsById(result.empId);
      const serviceDetails = await Service.findOne({
        where: { id: result.serviceId },
      });
      const rmDetails = await Utils.getDetailsById(details?.empManagerId);
      const empEmailOptions = {
        to: rmDetails?.email,
        template: "renewRequestToRm",
        subject: `Requesting Renewal for ${serviceDetails.name} subscription`,
        context: {
          '{empName}': details?.fullName,
          '{serviceName}': serviceDetails?.name,
          '{serviceName1}': serviceDetails?.name,
          '{serviceProvider}': serviceDetails?.provider,
          '{serviceLink}': serviceDetails?.link,
          '{reason}': req.body.reason,
          '{extendedDate}': moment(req.body.endDate).format(Constants.DATE_FORMAT),
          '{link}': `https://subscription.solutionanalysts.us/dashboard/${result.serviceId}`,
        },
      };
      Utils.emailSend(empEmailOptions);
      const response = ResponseBuilder.data(
        result,
        req.t("RENEW_APPLIED_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public getServiceDetailsById = async (req: Request, res: Response) => {
    const result = await this.serviceUtils.getServiceDetailsFromId(
      req.params.serviceId
    );
    if (result) {
      if (result?.code === 400) {
        return res.status(result?.code).json(result);
      } else {
        const response = ResponseBuilder.data(
          result,
          req.t("GET_REQUEST_SUCCESS")
        );
        return res.status(response.code).json(response);
      }
    } else {
      const response = ResponseBuilder.badRequest(req.t("NO_REQUEST_FOUND"));
      return res.status(response.code).json(response);
    }
  };

  public cancelService = async (req: Request, res: Response) => {
    const result = await this.serviceUtils.cancelRequestByUser(
      req.params.dateId,
      req.body
    );
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const details = await Dates.findOne({
        where: { id: req.params.dateId },
        include: [
          { model: Service, as: "service" },
          { model: Purchase, as: "purchase" },
          { model: OrganizationEmployee, as: "user" },
        ],
      });
      const adminOptions = {
        to: process.env.ACCOUNT_EMAIL,
        template: "renewCancelToAdmin",
        subject: `Request to cancel the subscription of ${details.user.fullName} for ${details.service.name}`,
        context: {
          '{empName}': details.user.fullName,
          '{serviceName}': details.service.name,
          '{serviceProvider}': details.service.provider,
          '{expiryDate}': moment(details.purchase.validateDate).format(
            Constants.DATE_FORMAT
          ),
          '{serviceLink}': details.service.link,
          '{purchaseEmail}': details.purchase.purchaseEmail,
          '{reason}': req.body.cancelReason,
        },
      };
      Utils.emailSend(adminOptions);
      const response = ResponseBuilder.data(
        result,
        req.t("APPLIED_FOR_CANCEL_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public getServiceDetailsByDateId = async (req: Request, res: Response) => {
    const result = await this.serviceUtils.getDateIdDetails(req.params.dateId);
    if (result) {
      if (result?.code === 400) {
        return res.status(result?.code).json(result);
      } else {
        const response = ResponseBuilder.data(
          result,
          req.t("GET_REQUEST_SUCCESS")
        );
        return res.status(response.code).json(response);
      }
    } else {
      const response = ResponseBuilder.badRequest(req.t("NO_REQUEST_FOUND"));
      return res.status(response.code).json(response);
    }
  };
}
