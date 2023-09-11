import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";

const { sequelize } = Connection.get();

const service_type = sequelize.define(
  Tables.SERVICE_TYPE,
  
  {
    id: {
      type: DataTypes.INTEGER,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      index: true,
    },
    type: {
      type: DataTypes.STRING,
      field: "type",
      allowNull: false,
    }
  },
  {
    tableName: Tables.SERVICE_TYPE,
  }
);

export default service_type;
