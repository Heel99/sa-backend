import service_provider from "../../models/service-provider";
import { ResponseBuilder } from "../../helpers/responseBuilder";

export class ServiceProviderUtils {
  public async getAllServiceProvider() { 
    return await service_provider.findAll(); 
  }
  public async createServiceProvider(req: any, data: any) {
    const findUser = await service_provider.findOne({ where: { name: data } });
    if (findUser) {
      return ResponseBuilder.badRequest(req.t("ALREADY_EXISTS_SERVICE_PROVIDER"));
    }
    else {
      let createServiceProvider = await service_provider.create({ name: data });
      return createServiceProvider;
    }
  }
  public async updateServiceProviderById() { }
  public async deleteServiceProviderById() { }
  public async getServiceProviderById() { }
}
