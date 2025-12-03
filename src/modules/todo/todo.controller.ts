import { Request, Response } from "express";
import { todoServices } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await todoServices.createTodo({ user_id, title });
    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "Data inserted successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
      success: "false",
    });
  }
};

const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getTodos();
    res.status(200).json({
      success: true,
      data: result.rows,
      message: "Todos fetched successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const getTodoWithId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await todoServices.getTodoWithId(id!);
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Todo not found",
        success: false,
      });
    } else {
      res.status(200).json({
        message: "Todo fetched successfully",
        data: result.rows[0],
        success: true,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTodoWithId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await todoServices.updateTodoWithId(id!, req.body);
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Todo not found",
        success: false,
      });
    } else {
      res.status(201).json({
        message: "Todo updated successfully",
        data: result.rows[0],
        success: true,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTodoWithId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await todoServices.deleteTodoWithId(id!);

    if (result.rowCount === 0) {
      res.status(404).json({
        message: "Todo not found",
        success: false,
      });
    } else {
      res.status(201).json({
        message: "Todo deleted successfully",
        data: null,
        success: true,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const todoControllers = {
  createTodo,
  getTodos,
  getTodoWithId,
  updateTodoWithId,
  deleteTodoWithId,
};
