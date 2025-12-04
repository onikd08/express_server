import { Router } from "express";
import { userControllers } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", userControllers.createUser);

router.get("/", logger, auth("admin"), userControllers.getUsers);

router.get("/:id", auth("admin", "user"), userControllers.getUserWithId);

router.put("/:id", userControllers.updateUserWithId);

router.delete("/:id", userControllers.deleteUserWithId);

export const userRoutes = router;
