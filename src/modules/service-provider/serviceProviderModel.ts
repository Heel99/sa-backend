import { IsEmail, IsNotEmpty, Validate, IsOptional } from "class-validator";
import { Model } from "../../model";

export class ServiceProviderModel extends Model {
  @IsNotEmpty({ message: "ERR_SERVICE_PROVIDER_REQUIRED" })
  public name: string;

  constructor(body: any) {
    super();
    const { name } = body;
    this.name = name;
  }
}