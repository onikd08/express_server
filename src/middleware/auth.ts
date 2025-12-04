import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      // console.log({ token });
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized",
          success: false,
        });
      }
      const decoded = jwt.verify(token, config.jwtSecret!) as JwtPayload;
      console.log({ decoded });
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          message: "Forbidden",
          success: false,
        });
      }
      next();
    } catch (error: any) {
      res.status(401).json({
        message: error.message,
        success: false,
      });
    }
  };
};

export default auth;
