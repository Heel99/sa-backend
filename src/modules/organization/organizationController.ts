import { Request, Response } from "express";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import { Utils } from "../../helpers/utils";
import { OrganizationUtils } from "./organizationUtils";
export class OrganizationController {
  private organizationUtils: OrganizationUtils = new OrganizationUtils();

  public getAllEmployee = async (req: Request, res: Response) => {
    const result = await this.organizationUtils.getOrganizationEmployee();
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("GET_ORGANIZATION_EMPLOYEE_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public getEmployee = async (req: Request, res: Response) => {
    const result = await this.organizationUtils.getEmployeebyId(req.params.id);
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("GET_ORGANIZATION_EMPLOYEE_")
      );
      return res.status(response.code).json(response);
    }
  };

  public createOrgEmployee = async (req: Request, res: Response) => {
    const welcomeEmailOption = {
      to: req.body.email,
      subject: "Welcome to Subscription Portal",
      template: "welcomeEmailToEmp",
      context: {
        '{empName}': req.body.fullName,
        '{email}': req.body.email,
        '{password}': req.body.password,
        '{link}': `https://subscription.solutionanalysts.us/login`,
      },
    };
    const result = await this.organizationUtils.createEmp(req.body);
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const verificationEmailOption = {
        to: req.body.email,
        subject: "Verification email",
        template: "signUpConfirm",
        context: {
          '{fullName}': req.body.fullName,
          '{link}': `https://subscription.solutionanalysts.us/verify/${result?.id}`,
        },
      };
      if (req.body?.companyName !== "") {
        Utils.emailSend(verificationEmailOption);
      } else {
        Utils.emailSend(welcomeEmailOption);
      }
      const response = ResponseBuilder.data(
        result,
        req.t("EMP_CREATED_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public deleteOrgEmployee = async (req: Request, res: Response) => {
    const result: any = await this.organizationUtils.deleteEmp(req.params.id);
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("EMP_DELETED_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public updateOrgEmployee = async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateEmpDetails = req.body;
    const result = await this.organizationUtils.updateEmp(
      id,
      updateEmpDetails
    );
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("EMP_UPDATED_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public createEmpDesignation = async (req: Request, res: Response) => {
    const applicationData = req.body;
    const result = await this.organizationUtils.createEmpDesignation(
      applicationData
    );
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("DESIGNATION_CREATED_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public getAllEmpDesignation = async (req: Request, res: Response) => {
    const result = await this.organizationUtils.getDesignation();
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(result, req.t("DESIGNATION_ALL"));
      return res.status(response.code).json(response);
    }
  };

  public createEmpDepartment = async (req: Request, res: Response) => {
    const applicationData = req.body;
    const result = await this.organizationUtils.createEmpDepartment(
      applicationData
    );
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(
        result,
        req.t("DEPARTMENT_CREATED_SUCCESS")
      );
      return res.status(response.code).json(response);
    }
  };

  public getAllEmpDepartment = async (req: Request, res: Response) => {
    const result = await this.organizationUtils.getEmpDepartment();
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(result, req.t("DEPARTMENT_All"));
      return res.status(response.code).json(response);
    }
  };

  public getAllisManager = async (req: Request, res: Response) => {
    const result = await this.organizationUtils.getOrganizationManagers();
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(result, req.t("MANAGERS_All"));
      return res.status(response.code).json(response);
    }
  };

  public verifySignUp = async (req: Request, res: Response) => {
    const result = await this.organizationUtils.updateVefiryFlag(req.params.id);
    if (result.code === 400) {
      return res.status(result.code).json(result);
    } else {
      const response = ResponseBuilder.data(result, req.t("VERIFED_ACCOUNT"));
      return res.status(response.code).json(response);
    }
  };
}
