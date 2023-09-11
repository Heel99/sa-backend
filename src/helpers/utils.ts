import PhoneNumber from "awesome-phonenumber";
import bcryptjs = require("bcryptjs");
import moment from "moment";
import { Constants } from "../config/constants";
import { Regex } from "../config/regex";
import OrganizationEmployee from "../models/orgEmp";
import Purchase from "../models/purchase";
const path = require("path");
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
import fs from "fs";
import { keys } from "lodash";

export class Utils {
  public static isValidPassword(data: string) {
    const regex = Regex.PASSWORD;
    return regex.test(data);
  }

  public static getPageSkipAndLimit(page: string, limit: string) {
    const limits = limit ? +limit : Constants.DATA_LIMIT; // for paginate records
    const pages = page ? +page : Constants.PAGE;
    return [pages > 1 ? (pages - 1) * limits : 0, limits];
  }

  public static convertPasswordInHash(password: string) {
    return bcryptjs.hashSync(password, Constants.HASH_PASSWORD_LENGTH);
  }

  public static compareHashPassword(password: string, existedPassword: string) {
    return bcryptjs.compareSync(password, existedPassword);
  }

  public static createRandomCode = async (
    length: number = Constants.VERIFICATION_CODE_LENGTH,
    forPassword: boolean = false
  ) => {
    let code = "";
    const characters = forPassword
      ? Regex.RANDOM_STRONG_PASSWORD
      : Regex.RECOVERY_CODE; // for referral code generator
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
  };

  public static getExpiryTime = (data: any) => {
    const codeExpiryTime = process.env.CODE_EXPIRY_TIME;
    return moment(data)
      .add(codeExpiryTime, Constants.CODE_EXPIRY_TIME_UNIT)
      .format(Constants.DEFAULT_TIME_STAMP_FORMAT);
  };

  public static getTime = () => {
    return moment().format(Constants.DEFAULT_TIME_STAMP_FORMAT);
  };

  public static getTimeDifference = (compareDate: Date, unit: any) => {
    return moment(Utils.getTodayDate()).diff(compareDate, unit);
  };

  public static getTodayDate = () => {
    return moment(new Date()).format(Constants.DEFAULT_TIME_STAMP_FORMAT);
  };

  public static isValidMobileNumber = (mobileNumber: string) => {
    const phoneNo = new PhoneNumber(
      mobileNumber,
      Constants.DEFAULT_COUNTRY_CODE
    );
    return phoneNo.isValid() && phoneNo.isMobile();
  };

  public static verifyAccountExpiryTime = () => {
    return moment()
      .add(
        Constants.ACCOUNT_LINK_EXPIRY_TIME,
        Constants.ACCOUNT_LINK_EXPIRY_UNIT
      )
      .format(Constants.DEFAULT_TIME_STAMP_FORMAT);
  };

  public static getSkipLimit = (
    page: number,
    recordsPerPage: number = null
  ) => {
    let skip = 0;
    const limit = recordsPerPage
      ? recordsPerPage
      : parseInt(process.env.DATA_LIMIT); // for paginate records
    if (page) {
      skip = (page - 1) * limit;
    }
    return { limit, skip };
  };

  public static filterValidRequestedObject = (
    requestedType: JsonArray,
    allowedType: any
  ) => {
    const roleObj: any = {};
    if (requestedType.length > 0) {
      allowedType.forEach((v: any) => {
        if (requestedType.includes(v.key)) {
          roleObj[v.value] = true;
        } else {
          roleObj[v.value] = false;
        }
      });
    }
    return roleObj;
  };

  public static calculateAge = (date: string) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };
  public static getYMDformat = (date: any) => {
    return moment(date).format(Constants.DEFAULT_TIME_FORMAT);
  };

  public static getDifferenceInDays = (
    startDate,
    endDate,
    dateFormat = "YYYY-MM-DD"
  ) => {
    const getDateAsArray = (date) => {
      return moment(date.split(/\D+/), dateFormat);
    };
    return getDateAsArray(endDate).diff(getDateAsArray(startDate), "days") + 1;
  };

  public static getHtmlContent = (filePath: string, replaceData: any) => {
    const data = fs.readFileSync(filePath);
    let html = data.toString();
    keys(replaceData).forEach((key) => {
      html = html.replace(key, replaceData[key]);
    });
    return html;
  };

  public static async emailSend(body) {
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve("./views/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./views/"),
    };
    let html = "";
    let replaceData = body?.context;
    if (body?.template) {
      const templatesDir = path.resolve(`${__dirname}/../`, "templates");
      const content = `${templatesDir}/${body?.template}.html`;
      html = this.getHtmlContent(content, replaceData);
    }

    const mailOptions = {
      from: process.env.MAIL_FROM,
      html,
      replyTo: process.env.MAIL_FROM,
      subject: body?.subject,
      to: body?.to,
      bcc: body?.to,
      text: "",
    };

    const transportObj = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(transportObj);

    transporter.use("compile", hbs(handlebarOptions));
    transporter.sendMail(mailOptions, (mailSendErr: any, info: any) => {
      console.log("sent mail successfully ", mailSendErr, info);
    });
  }

  public static calcDifference(date: any) {
    const startDate = moment();
    const endDate = moment(date, Constants.DATE_STORE_FORMAT);
    const diff = endDate.diff(startDate, "days");
    return diff;
  }

  public static async getDetailsById(id: number) {
    const details = await OrganizationEmployee.findOne({
      where: {
        empId: id,
      },
    });
    return details;
  }

  public static async updateFlag(id: number, val: number) {
    await Purchase.update({ emailSentCount: val }, { where: { id: id } });
  }

  public static countDuration = (startDate, endDate) => {
    const s_date = moment(startDate);
    const e_date = moment(endDate);
    const difInDays = e_date.diff(s_date, "days");
    return Math.round(difInDays / 30);
  };
}
