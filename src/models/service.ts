import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";
import Dates from "./dates";
import Purchase from "./purchase";

const { sequelize } = Connection.get();

const Service = sequelize.define(
  Tables.SERVICE,
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
    type: {
      type: DataTypes.STRING,
      field: "type",
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      field: "provider",
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      field: "link",
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      field: "price",
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
    tableName: Tables.SERVICE,
  }
);

export default Service;
