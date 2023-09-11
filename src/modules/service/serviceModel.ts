import { IsNotEmpty } from "class-validator";
import { Model } from "../../model";

export class ServiceModel extends Model {
  @IsNotEmpty({ message: "ERR_SERVICE_NAME_REQUIRED" })
  name: string;
  @IsNotEmpty({ message: "ERR_SERVICE_TYPE_REQUIRED" })
  type: string;
  @IsNotEmpty({ message: "ERR_SERVICE_PROVIDER_REQUIRED" })
  provider: string;
  @IsNotEmpty({ message: "ERR_SERVICE_WEB_LINK_REQUIRED" })
  link: string;
  @IsNotEmpty({ message: "ERR_PRICE_REQUIRED" })
  price: string;

  constructor(body: any) {
    super();
    const { name, type, provider, link, price } = body;
    this.name = name;
    this.type = type;
    this.provider = provider;
    this.link = link;
    this.price = price;
  }
}
