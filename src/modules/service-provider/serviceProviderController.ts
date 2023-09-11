import { ServiceProviderUtils } from "./serviceProviderUtils";
import { Request, Response } from "express";
import { ResponseBuilder } from "../../helpers/responseBuilder";

export class ServiceProviderController {
  private serviceProviderUtils: ServiceProviderUtils = new ServiceProviderUtils();

  public getAllServiceProvider = async (req: Request, res: Response) => {
    try {
      let result = await this.serviceProviderUtils.getAllServiceProvider();
      let response = ResponseBuilder.data(result, req.t("GET_ALL_SERVICE_PROVIDER"));
      return res.status(response.code).json(response);
    } catch (err) {
      let response = ResponseBuilder.errorMessage(req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.code).json(response);
    }
  };

  public createServiceProvider = async (req: Request, res: Response) => {
    try {
      let result = await this.serviceProviderUtils.createServiceProvider(req, req.body.name);
      if (result.code === 400) {
        return res.status(result.code).json(result);
      } else {
        let response = ResponseBuilder.data(result, req.t("SUCCESS_SERVICE_PROVIDER"));
        return res.status(response.code).json(response);
      }
    } catch (err) {
      let response = ResponseBuilder.errorMessage(req.t("ERR_INTERNAL_SERVER"));
      return res.status(response.code).json(response);
    }

  };

  public updateServiceProviderById = async (req: Request, res: Response) => { }

  public deleteServiceProviderById = async (req: Request, res: Response) => { };

  public getServiceProviderById = async (req: Request, res: Response) => { }
}
