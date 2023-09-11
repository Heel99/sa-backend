import OrganizationEmployee from "../../models/orgEmp";
import bcrypt from "bcrypt";
import emp_designation from "../../models/empDesignation";
import emp_department from "../../models/empDepartment";
import { Op } from "sequelize";

const saltRounds = 10;

export class OrganizationUtils {
  public getOrganizationEmployee = async () => {
    return await OrganizationEmployee.findAll();
  };

  public getEmployeebyId = async (id: any) => {
    const result = await OrganizationEmployee.findOne({
      attributes: [
        "id",
        "fullName",
        "empId",
        "empDesignation",
        "empDepartment",
        "empRole",
        "email",
        "empManager",
        "empManagerId",
        "isVerified",
      ],
      where: { id: id },
    });
    if (result) {
      return result;
    } else {
      return { code: 400, message: 'No user found for this ID' };
    }
  };

  public createEmp = async (data) => {
    const hashPassword = await bcrypt.hash(data?.password, saltRounds);
    data.password = hashPassword;
    return await OrganizationEmployee.create(data);
  };

  public deleteEmp = async (id: any) => {
    return await OrganizationEmployee.destroy({ where: { id: id } });
  };

  public updateEmp = async (id: any, UpdateData: any) => {
    return await OrganizationEmployee.update(UpdateData, { where: { id: id } });
  };

  public createEmpDesignation = async (insertdata: any) => {
    return await emp_designation.create({ ...insertdata });
  };

  public getDesignation = async () => {
    return await emp_designation.findAll();
  };

  public createEmpDepartment = async (insertdata: any) => {
    return await emp_department.create({ ...insertdata });
  };

  public getEmpDepartment = async () => {
    return await emp_department.findAll();
  };

  public getOrganizationManagers = async () => {
    return await OrganizationEmployee.findAll({
      attributes: ['id', 'fullName', 'empId'],
      where: {
        [Op.or]: [{ empRole: 'Approver' }, { empRole: 'Admin' }, { isMasterAdmin: true }],
      },
    });
  };

  public updateVefiryFlag = async (id) => {
    return await OrganizationEmployee.update({ isVerified: true }, { where: { id: id } });
  };
}
