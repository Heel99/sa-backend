import { DataTypes } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../database";

const { sequelize } = Connection.get();

const OrganizationEmployee = sequelize.define(
  Tables.ORG_EMP,
  {
    id: {
      type: DataTypes.INTEGER,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      index: true,
    },
    fullName: {
      type: DataTypes.STRING,
      field: "fullName",
    },
    email: {
      type: DataTypes.STRING,
      field: "email",
    },
    address1 : {
      type: DataTypes.STRING,
      field: "address1",
    },
    address2 : {
      type: DataTypes.STRING,
      field: "address2",
    },
    country: {
      type: DataTypes.STRING,
      field: "country",
    },
    password: {
      type: DataTypes.STRING,
      field: "password",
    },
    empId: {
      type: DataTypes.STRING,
      field: "empId",
    },
    empDesignation: {
      type: DataTypes.STRING,
      field: "empDesignation",
    },
    empRole: {
      type: DataTypes.STRING,
      field: "empRole",
    },
    empDepartment: {
      type: DataTypes.STRING,
      field: "empDepartment",
    },
    empManager: {
      type: DataTypes.STRING,
      field: "empManager",
    },
    empManagerId: {
      type: DataTypes.STRING,
      field: "empManagerId",
    },
    isMasterAdmin: {
      type: DataTypes.BOOLEAN,
      field: "isMasterAdmin",
      default: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      field: "isVerified",
      default: false,
    },
    companyName: {
      type: DataTypes.STRING,
      field: "companyName",
    },
    isFirstLogin : {
      type: DataTypes.BOOLEAN,
      field: "isFirstLogin"
    },
    resetToken: {
      type: DataTypes.STRING,
      field: "resetToken",
    },
    hasChangedPassword: {
      type: DataTypes.BOOLEAN,
      field: "hasChangedPassword",
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
    tableName: Tables.ORG_EMP,
  }
);

export default OrganizationEmployee;
