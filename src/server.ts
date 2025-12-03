import express, { Request, Response } from "express";
import config from "./config";
import { initDB } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";

const app = express();
const port = config.port;

// parser
app.use(express.json());
// form data
app.use(express.urlencoded({ extended: true }));

initDB(); // initialize database

// logger middleware
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello World");
});

// users API
app.use("/users", userRoutes);

// todos api
app.use("/todos", todoRoutes);

// Not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
