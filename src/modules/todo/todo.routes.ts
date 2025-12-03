import { Router } from "express";
import { todoControllers } from "./todo.controller";

const router = Router();

router.post("/", todoControllers.createTodo);

router.get("/", todoControllers.getTodos);

router.get("/:id", todoControllers.getTodoWithId);

router.put("/:id", todoControllers.updateTodoWithId);

router.delete("/:id", todoControllers.deleteTodoWithId);

export const todoRoutes = router;
