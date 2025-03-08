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
const authMiddleware = async (
  req: Request,
  next: NextFunction,
  res: Response,
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  let decodedToken: IJWTPayload;
  try {
    decodedToken = jwt.verify(
      token as string,
      config.JWT_SECRET as string,
    ) as IJWTPayload;

    if (decodedToken) {
      req.body.username = decodedToken.username;
      next();
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).send({ message: "Token Expired" });
      return;
    }
    res.status(401).send({ message: "Invalid Token" });
    return;
  }
};

export default authMiddleware;
