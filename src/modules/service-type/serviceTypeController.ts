import { ServiceTypeUtils } from "./serviceTypeUtils";
import { Request, Response } from "express";
import { ResponseBuilder } from "../../helpers/responseBuilder";

export class ServiceTypeController {
  private serviceTypeUtils: ServiceTypeUtils = new ServiceTypeUtils();

  public createServiceType = async (req: Request, res: Response) => {
    let result = await this.serviceTypeUtils.createServiceType(
      req,
      req.body.type
    );
    3;

    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      let response = ResponseBuilder.data(
        result,
        req.t("SUCCESS_SERVICE_TYPE")
      );
      return res.status(response.code).json(response);
    }
  };

  public getAllServiceTypes = async (req: Request, res: Response) => {
    try {
      let result = await this.serviceTypeUtils.getAllServiceTypes();
      let response = ResponseBuilder.data(
        result,
        req.t("GET_ALL_SERVICE_TYPE")
      );
      return res.status(response.code).json(response);
    } catch (err) {
      let response = ResponseBuilder.errorMessage(req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.code).json(response);
    }
  };
}
