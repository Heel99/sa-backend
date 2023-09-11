import { IsEmail, IsNotEmpty, Validate, IsOptional } from "class-validator";
import { Model } from "../../model";

export class ServiceTypeModel extends Model {
  @IsNotEmpty({ message: "ERR_SERVICE_TYPE_REQUIRED" })
  public type: string;

  constructor(body: any) {
    super();
    const { type } = body;
    this.type = type;
  }
}