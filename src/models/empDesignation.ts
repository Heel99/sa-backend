import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";

const { sequelize } = Connection.get();

const emp_designation = sequelize.define(
  Tables.EMP_DESIGNATION,
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
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "createdAt",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updatedAt",
    },
  },
  {
    tableName: Tables.EMP_DESIGNATION,
  }
);

export default emp_designation;
