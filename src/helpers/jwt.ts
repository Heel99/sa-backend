import jwt from "jsonwebtoken";
import { Constants } from "../config/constants";

export class Jwt {
  /*
   * getAuthToken
   */
  public static createSecretToken(data: any) {
    return jwt.sign(data, process.env.JWT_SECRET, {
      //expiresIn: '12h' // expires in 24 hours
    });
  }


  /*
   * decodeAuthToken
   */
  public static decodeAuthToken(token: string) {
    if (token) {
      try { 
        return jwt.verify(token, `${process.env.JWT_SECRET}` as string); 
      } catch (error) {
        if (error.name == Constants.TOKEN_EXPIRE_ERROR) {
          return error.name;
        }
        return false;
      }
    }
    return false;
  }
}
