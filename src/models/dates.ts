import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";
import Service from "./service";
import OrganizationEmployee from "./orgEmp";

const { sequelize } = Connection.get();

const Dates = sequelize.define(
  Tables.DATES,

  {
    id: {
      type: DataTypes.INTEGER,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      index: true,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      field: "serviceId",
    },
    startDate: {
      type: DataTypes.DATE,
      field: "startDate",
    },
    endDate: {
      type: DataTypes.DATE,
      field: "endDate",
    },
    approverDate: {
      type: DataTypes.DATE,
      field: "approverDate",
    },
    adminDate: {
      type: DataTypes.DATE,
      field: "adminDate",
    },
    empId: {
      type: DataTypes.STRING,
      field: "empId",
    },
    rmId: {
      type: DataTypes.STRING,
      field: "rmId",
    },
    reason: {
      type: DataTypes.STRING,
      field: "reason",
      allowNull: false,
    },
    rmStatus: {
      type: DataTypes.STRING,
      field: "rmStatus",
      default: "Requested",
    },
    rmRemark: {
      type: DataTypes.STRING,
      field: "rmRemark",
    },
    adminStatus: {
      type: DataTypes.STRING,
      field: "adminStatus",
    },
    adminRemark: {
      type: DataTypes.STRING,
      field: "adminRemark",
    },
    isExpired: {
      type: DataTypes.BOOLEAN,
      field: "isExpired",
      default: false,
    },
    isLatest: {
      type: DataTypes.BOOLEAN,
      field: "isLatest",
      default: true,
    },
    renewByUserAt: {
      type: DataTypes.DATE,
      field: "renewByUserAt",
      default: null,
    },
    renewReason: {
      type: DataTypes.STRING,
      field: "renewReason",
      default: null,
    },
    cancelByUserAt: {
      type: DataTypes.DATE,
      field: "cancelByUserAt",
      default: null,
    },
    cancelReason: {
      type: DataTypes.STRING,
      field: "cancelReason",
      default: null,
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
    tableName: Tables.DATES,
  }
);

Service.hasMany(Dates, {
  as: "date",
  onDelete: "cascade",
  foreignKey: "serviceId",
});

Dates.belongsTo(Service, {
  as: "service",
  onDelete: "cascade",
  foreignKey: "serviceId",
});

OrganizationEmployee.hasOne(Dates, {
  as: "user",
  onDelete: "cascade",
  foreignKey: "empId",
});

Dates.belongsTo(OrganizationEmployee, {
  as: "user",
  onDelete: "cascade",
  foreignKey: "empId",
});

export default Dates;
