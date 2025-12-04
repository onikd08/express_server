import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUser(req.body);
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

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsers();
    res.status(200).json({
      success: true,
      data: result.rows,
      message: "Users fetched successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const getUserWithId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userServices.getUserWithId(id!);
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
    } else {
      res.status(200).json({
        message: "User fetched successfully",
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

const updateUserWithId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await userServices.updateUserWithId(id!, name, email);
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
    } else {
      res.status(201).json({
        message: "User updated successfully",
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

const deleteUserWithId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userServices.deleteUserWithId(id!);

    if (result.rowCount === 0) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
    } else {
      res.status(201).json({
        message: "User deleted successfully",
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

export const userControllers = {
  createUser,
  getUsers,
  getUserWithId,
  updateUserWithId,
  deleteUserWithId,
};
