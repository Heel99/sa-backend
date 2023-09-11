import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";
import Dates from "./dates";
import Service from "./service";

const { sequelize } = Connection.get();

const Purchase = sequelize.define(
  Tables.PURCHASE,
  {
    id: {
      type: DataTypes.INTEGER,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      index: true,
    },
    dateId: {
      type: DataTypes.INTEGER,
      field: "dateId",
      allowNull: false,
      references: {
        model: Dates,
        key: "id",
      },
    },
    purchaseDate: {
      type: DataTypes.DATE,
      field: "purchaseDate",
    },
    validateDate: {
      type: DataTypes.DATE,
      field: "validateDate",
    },
    purchasePrice: {
      type: DataTypes.STRING,
      field: "purchasePrice",
    },
    purchaseEmail: {
      type: DataTypes.STRING,
      field: "purchaseEmail",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      field: "paymentMethod",
    },
    isNormalPurchase: {
      type: DataTypes.BOOLEAN,
      field: "isNormalPurchase",
      default: true,
    },
    emailSentCount: {
      type: DataTypes.INTEGER,
      field: "emailSentCount",
      default: 0,
    },
    isExpired: {
      type: DataTypes.BOOLEAN,
      field: "isExpired",
      default: false,
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
    tableName: Tables.PURCHASE,
  }
);

Dates.hasOne(Purchase, {
  as: "purchase",
  onDelete: "cascade",
  foreignKey: "dateId",
});

Purchase.belongsTo(Dates, {
  as: "dates",
  onDelete: "cascade",
  foreignKey: "dateId",
});

export default Purchase;
