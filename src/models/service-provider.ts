import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";

const { sequelize } = Connection.get();

const service_provider = sequelize.define(
  Tables.SERVICE_PROVIDER,
  {
    id: {
      type: DataTypes.INTEGER,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      index: true,
    },
    name: {
      type: DataTypes.STRING,
      field: "name",
      allowNull: false,
    }
  },
  {
    tableName: Tables.SERVICE_PROVIDER,
  }
);

export default service_provider;
