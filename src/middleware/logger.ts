import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  fs.writeFileSync(
    path.join(process.cwd(), "log.txt"),
    `[${new Date().toISOString()}] ${req.method} ${req.path}\n`
  );
  next();
};

export default logger;
