import compression from "compression";
import dotenv from "dotenv";
import express from "express";
// tslint:disable-next-line:no-var-requires
require("express-async-errors");
import fileUpload from "express-fileupload";
import helmet from "helmet"; // Security
import l10n from "jm-ez-l10n";
import methodOverride from "method-override"; // simulate DELETE and PUT (express4)
import morgan from "morgan"; // log requests to the console (express4)
import path from "path";
import trimRequest from "trim-request";
import { Constants } from "./config/constants";
import { Log } from "./helpers/logger";
import { Routes } from "./routes";
import cors from "cors";
// import { CronController } from "././modules/cron/cronController"
import cronStart from "./modules/cron/cronController";

dotenv.config();
// initialize database

export class App {
  protected app: express.Application;
  private logger = Log.getLogger();
  constructor() {
    const NODE_ENV = process.env.NODE_ENV;
    const PORT = process.env.PORT;
    this.app = express();
    this.app.use(cors())
    this.app.use(helmet());
    this.app.all("/*", (req: any, res: any, next: () => void) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Request-Headers", "*");
      // tslint:disable-next-line: max-line-length
      res.header(
        "Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, Authorization,x-l10n-locale, fingerjstoken, devicetype, apptoken"
      );
      res.header("Access-Control-Allow-Methods", "GET, POST , DELETE ,PUT");
      if (req.method === "OPTIONS") {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
      });
        res.end();
      } else {
        next();
      }
    });

    if (NODE_ENV === "development") {
      this.app.use(express.static(path.join(process.cwd(), "public")));
      // set the static files location of bower_components
      this.app.use(morgan("dev")); // log every request to the console
    } else {
      this.app.use(compression());
      // set the static files location /public/img will be /img for users
      this.app.use(
        express.static(path.join(process.cwd(), "dist"), { maxAge: "7d" })
      );
    }

    l10n.setTranslationsFile("en", "src/language/translation.en.json");
    this.app.use(l10n.enableL10NExpress);
    this.app.use(
      fileUpload({
        parseNested: true,
      })
    );
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    this.app.use(express.json(), (error, req, res, next) => {
      if (error) {
        return res
          .status(Constants.FAIL_CODE)
          .json({ error: req.t("ERR_GENRIC_SYNTAX") });
      }
      next();
    });
    this.app.use(express.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
    this.app.use(methodOverride());
    this.app.use(trimRequest.all);
    const routes = new Routes(NODE_ENV);
    this.app.use("/api/v1", routes.path());
    cronStart();

    this.app.use((err: any, req: any, res: any, next: () => void) => {
      if (err) {
        console.log(err);
        res
          .status(Constants.FAIL_CODE)
          .json({ error: req.t("SOMETHING_WENT_WRONG") });
        return;
      } else {
        next();
      }
    });

    if (process.env.NODE_ENV !== "test") {
      this.app.listen(PORT || 8080, () => {
        this.logger.info(
          `The server is running in port localhost: ${process.env.PORT || 8080}`
        );
      });
    }
  }

  public getInstance() {
    return this.app;
  }
}
