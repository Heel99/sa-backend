import express = require("express");
import { Request, Response } from "express";
import l10n from "jm-ez-l10n";
import { ServiceProviderRoute } from "./modules/service-provider/serviceProviderRoute";
import { ServiceTypeRoute } from "./modules/service-type/serviceTypeRoute";
import { ServiceRoute } from "./modules/service/serviceRoute";
import { AdminRoute } from "./modules/admin/adminRoute";
import { OrganizationRoute } from "./modules/organization/organizatiionRoutes";
import { AuthRoute } from "./modules/auth/authRoutes";

export class Routes {
  protected basePath: string;

  constructor(NODE_ENV: string) {
    switch (NODE_ENV) {
      case "production":
        this.basePath = "/app/dist";
        break;
      case "development":
        this.basePath = "/app/public";
        break;
    }
  }

  public defaultRoute(_req: Request, res: Response) {
    res.json({
      message: "Hello !",
    });
  }

  public path() {
    const router = express.Router();
    router.use("/service-provider", ServiceProviderRoute);
    router.use("/service-type", ServiceTypeRoute);
    router.use("/service", ServiceRoute);
    router.use("/admin", AdminRoute);
    router.use("/employee", OrganizationRoute);
    router.use("/auth", AuthRoute);

    router.all("/*", (_req, res) => {
      return res.status(404).json({
        error: l10n.t("ERR_URL_NOT_FOUND"),
      });
    });

    return router;
  }
}
