import moment from "moment";
import { Sequelize } from "sequelize";
import { Constants } from "../../config/constants";
import { Utils } from "../../helpers/utils";
import Dates from "../../models/dates";
import OrganizationEmployee from "../../models/orgEmp";
import Purchase from "../../models/purchase";
import Service from "../../models/service";

export class CronUtils {
  public async getReminderCron() {
    const before10daysReminder = async () => {
      const services = await Dates.findAll({
        include: [
          {
            model: Service,
            as: "service",
          },
          {
            model: OrganizationEmployee,
            as: "user",
            attributes: [
              "email",
              "fullName",
              "empId",
              "empManagerId",
              "empManager",
            ],
          },
          {
            model: Purchase,
            as: "purchase",
            where: Sequelize.where(
              Sequelize.fn("date", Sequelize.col("validateDate")),
              "=",
              moment().add(10, "days").format(Constants.DATE_STORE_FORMAT)
            ),
          },
        ],
      });

      for (let item of services) {
        const adminEmailOptions = {
          to: process.env.ACCOUNT_EMAIL,
          template: "before10daystoAdmin",
          subject: `Reminder: Subscription of ${item.service.name} expiring in 10 days`,
          context: {
            "{serviceName}": item.service.name,
            "{serviceName1}": item.service.name,
          },
        };
        const employeeOptions = {
          to: item.user.email,
          template: "before10daystoEmp",
          subject: `Reminder: Your subscription of ${item.service.name} is expiring soon`,
          context: {
            "{empName}": item.user.fullName,
            "{serviceName}": item.service.name,
            "{serviceName1}": item.service.name,
            "{serviceProvider}": item.service.provider,
            "{validateDate}": moment(item.purchase.validateDate).format(
              Constants.DATE_FORMAT
            ),
            "{link}": `https://subscription.solutionanalysts.us/renew/${item?.id}`,
          },
        };
        Utils.emailSend(adminEmailOptions);
        Utils.emailSend(employeeOptions);
      }
    };

    const before2daysReminder = async () => {
      const services = await Dates.findAll({
        include: [
          {
            model: Service,
            as: "service",
          },
          {
            model: OrganizationEmployee,
            as: "user",
          },
          {
            model: Purchase,
            as: "purchase",
            where: Sequelize.where(
              Sequelize.fn("date", Sequelize.col("validateDate")),
              "=",
              moment().add(3, "days").format(Constants.DATE_STORE_FORMAT)
            ),
          },
        ],
      });

      for (let item of services) {
        if (!item.renewByUserAt && !item.cancelByUserAt) {
          const employeeOptions = {
            to: item.user.email,
            template: "before2daysEmp",
            subject: `Reminder 2: Your subscription of ${item.service.name} is expiring soon`,
            context: {
              "{empName}": item.user.fullName,
              "{serviceName}": item.service.name,
              "{serviceName1}": item.service.name,
              "{serviceProvider}": item.service.provider,
              "{validateDate}": moment(item.purchase.validateDate).format(
                Constants.DATE_FORMAT
              ),
              "{link}": `https://subscription.solutionanalysts.us/renew/${item?.id}`,
            },
          };
          const adminEmailOptions = {
            to: process.env.ACCOUNT_EMAIL,
            template: "before2daysAdmin",
            subject: `Reminder 2: Subscription of ${item.service.name} expiring soon`,
            context: {
              "{empName}": item.user.fullName,
              "{empName1}": item.user.fullName,
              "{serviceName}": item.service.name,
            },
          };
          Utils.emailSend(employeeOptions);
          Utils.emailSend(adminEmailOptions);
        } else if (item?.cancelByUserAt && !item?.purchase?.expired) {
          const adminEmailOptions = {
            to: process.env.ACCOUNT_EMAIL,
            template: "cancelByUserToAdmin2days",
            subject: `Reminder 2: Subscription of ${item.service.name} cancellation`,
            context: {
              "{empName}": item.user.fullName,
              "{serviceName}": item.service.name,
              "{serviceProvider}": item.service.provider,
            },
          };
          Utils.emailSend(adminEmailOptions);
        }
      }
    };

    const onDayExpirationReminder = async () => {
      const services = await Dates.findAll({
        include: [
          {
            model: Service,
            as: "service",
          },
          {
            model: OrganizationEmployee,
            as: "user",
          },
          {
            model: Purchase,
            as: "purchase",
            where: Sequelize.where(
              Sequelize.fn("date", Sequelize.col("validateDate")),
              "=",
              moment().format(Constants.DATE_STORE_FORMAT)
            ),
          },
        ],
      });

      for (let item of services) {
        if (!item.renewByUserAt && !item.cancelByUserAt) {
          const employeeOptions = {
            to: item.user.email,
            template: "forcefullyCancelToEmp",
            subject: `Forcefully cancellation for subscription ${item.service.name}`,
            context: {
              "{empName}": item.user.fullName,
              "{serviceName}": item.service.name,
              "{serviceName1}": item.service.name,
              "{serviceProvider}": item.service.provider,
            },
          };
          const adminEmailOptions = {
            to: process.env.ACCOUNT_EMAIL,
            template: "forcefullyCancelToAdmin",
            subject: `Forcefully cancellation for subscription ${item.service.name}`,
            context: {
              "{empName}": item.user.fullName,
              "{serviceName}": item.service.name,
              "{serviceProvider}": item.service.provider,
              "{link}": `https://subscription.solutionanalysts.us/admin/cancel/${item?.id}`,
            },
          };
          Utils.emailSend(employeeOptions);
          Utils.emailSend(adminEmailOptions);
        } else if (item?.cancelByUserAt && !item?.purchase?.isExpired) {
          const adminEmailOptions = {
            to: process.env.ACCOUNT_EMAIL,
            template: "onDayExpiryCancel",
            subject: `Subscription ${item.service.name} Expiring`,
            context: {
              "{empName}": item.user.fullName,
              "{serviceName}": item.service.name,
              "{serviceLink}": item.service.link,
              "{userId}": item.purchase.purchaseEmail,
              "{serviceProvider}": item.service.provider,
              "{link}": `https://subscription.solutionanalysts.us/admin/cancel/${item?.id}`,
            },
          };
          Utils.emailSend(adminEmailOptions);
        }
      }
    };

    const setExpirationOfRenewedService = async () => {
      const servicesExpired = await Dates.findAll({
        include: [
          {
            model: Service,
            as: "service",
          },
          {
            model: OrganizationEmployee,
            as: "user",
          },
          {
            model: Purchase,
            as: "purchase",
            where: Sequelize.where(
              Sequelize.fn("date", Sequelize.col("validateDate")),
              "=",
              moment().subtract(1, "days").format(Constants.DATE_STORE_FORMAT)
            ),
          },
        ],
      });
      const result = await Purchase.update(
        { isExpired: true },
        {
          where: Sequelize.where(
            Sequelize.fn("date", Sequelize.col("validateDate")),
            "=",
            moment().subtract(1, "days").format(Constants.DATE_STORE_FORMAT)
          ),
        }
      );

      if (result) {
        for (let item of servicesExpired) {
          const adminEmailOptions = {
            to: process.env.ACCOUNT_EMAIL,
            template: "autoExpireToAdmin",
            subject: `Subscription ${item.service.name} has Auto Expired`,
            context: {
              "{empName}": item.user.fullName,
              "{serviceName}": item.service.name,
              "{serviceName1}": item.service.name,
              "{serviceLink}": item.service.link,
              "{userId}": item.purchase.purchaseEmail,
              "{serviceProvider}": item.service.provider,
            },
          };
          Utils.emailSend(adminEmailOptions);
        }
      }
    };

    before10daysReminder();
    before2daysReminder();
    onDayExpirationReminder();
    setExpirationOfRenewedService();
  }
}
