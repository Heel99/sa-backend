import dotenv from "dotenv";
import jwt_decode from "jwt-decode";
import { ResponseBuilder } from "./helpers/responseBuilder";
dotenv.config();

export class Middleware {
  public getDataFromToken = (req, res, next) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      const response = ResponseBuilder.badRequest("A token is required for getting data")
      return res.status(response.code).json(response)
    }
    try {
      const decoded = jwt_decode(token);
      req.data = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  };
}
