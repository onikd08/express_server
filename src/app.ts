import express, { Request, Response } from "express";
import { initDB } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();

// parser
app.use(express.json());
// form data
app.use(express.urlencoded({ extended: true }));

initDB(); // initialize database

// users API
app.use("/users", userRoutes);

// api todos
app.use("/todos", todoRoutes);

// auth api
app.use("/auth", authRoutes);

// Not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API not found",
    path: req.path,
  });
});

export default app;
