import service_type from "../../models/service-type";
import { ResponseBuilder } from "../../helpers/responseBuilder";

export class ServiceTypeUtils {
  public async createServiceType(req: any, data: any) {
    const findType = await service_type.findOne({ where: { type: data } });
    if (findType) {
      return ResponseBuilder.badRequest(req.t("ALREADY_EXISTS_SERVICE_TYPE"));
    }
    else {
      let createServiceType = await service_type.create({ type: data });
      return createServiceType;
    }
  }

  public async getAllServiceTypes() { 
    return await service_type.findAll(); 
  }
}
