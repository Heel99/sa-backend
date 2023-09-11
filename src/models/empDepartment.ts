import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";

const { sequelize } = Connection.get();

const emp_department = sequelize.define(
  Tables.EMP_DEPARTMENT,
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
    tableName: Tables.EMP_DEPARTMENT,
  }
);

export default emp_department;
