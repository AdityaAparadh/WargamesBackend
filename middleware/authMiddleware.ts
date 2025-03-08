import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

/**
 * @interface IJWTPayload
 * @description Interface for the JWT Payload
 */
export interface IJWTPayload {
  username: string;
}

/**
 * Middleware to check if user is authorized
 */
const Auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(
      token as string,
      config.JWT_SECRET as string,
    ) as IJWTPayload;

    if (decodedToken) {
      req.body.username = decodedToken.username;
      // next();
      return;
    } else {
      return res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ message: "Token Expired" });
    }
    return res.status(401).send({ message: "Invalid Token" });
  }
};

export default Auth;
