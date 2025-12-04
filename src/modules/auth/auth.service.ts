import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (result.rows.length === 0) return null;
  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    config.jwtSecret!,
    {
      expiresIn: "7d",
    }
  );
  //console.log(token);
  return { token, user };
};

const authServices = {
  loginUser,
};

export default authServices;
