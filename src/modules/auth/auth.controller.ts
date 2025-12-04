import { Request, Response } from "express";
import authServices from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authServices.loginUser(email, password);
    if (!result) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
    } else {
      res.status(200).json({
        message: "User logged in successfully",
        data: result,
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

const authController = {
  loginUser,
};

export default authController;
