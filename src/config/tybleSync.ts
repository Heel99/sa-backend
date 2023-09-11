import { DataTypes } from "sequelize";
import { Log } from "../helpers/logger";
import emp_designation from "../models/empDesignation";

const logger = Log.getLogger();

async function tablesync(db: any) {
  // Create a specialties_vo Table
  db.emp_designation = emp_designation(db.sequelize, DataTypes);

    db.sequelize.sync().then(() => {
    logger.info("Successfully Sync");
  });
}

export default tablesync;
