import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { Log } from "./helpers/logger";

dotenv.config();
export class Connection {

  public static get(): Connection {
    if (!Connection.instance) {
      Connection.instance = new Connection();
    }
    return Connection.instance;
  }
  private static instance: Connection;
  public sequelize: any;

  private logger = Log.getLogger();

  private constructor() {
    const database = process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE : process.env.DATABASE || 'date_change_schema';
    this.sequelize = new Sequelize(database, process.env.DBUSER || 'Manish_Admin', process.env.DBPASSWORD || 'Manish@123' , {
      //port: 5433,
      host: process.env.DBHOST,
      dialect: "mysql",
      pool: {
        max: +process.env.DB_MAX_CONNECTION_LIMIT || 100,
        idle: +process.env.DB_IDLE_CONNECTION_LIMIT || 10000,
      },
      logging: true,
      //timezone: Constants.TIMEZONE,
      dialectOptions: {
        multipleStatements: true,
      },
    });

    this.sequelize.authenticate().then(() => {
      this.logger.info("Connection has been established successfully.");
    }).catch((err: any) => {
      this.logger.error("Unable to connect to the database:", err);
    });

    }
  }
