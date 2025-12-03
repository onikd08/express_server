import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

router.post("/", userControllers.createUser);

router.get("/", userControllers.getUsers);

router.get("/:id", userControllers.getUserWithId);

router.put("/:id", userControllers.updateUserWithId);

router.delete("/:id", userControllers.deleteUserWithId);

export const userRoutes = router;
