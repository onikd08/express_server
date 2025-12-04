import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, role } = payload;
  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *`,
    [name, email, hashedPassword, role]
  );
  return result;
};

const getUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getUserWithId = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

const updateUserWithId = async (id: string, name: string, email: string) => {
  const result = await pool.query(
    `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
    [name, email, id]
  );
  return result;
};

const deleteUserWithId = async (id: string) => {
  const result = pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};
export const userServices = {
  createUser,
  getUsers,
  getUserWithId,
  updateUserWithId,
  deleteUserWithId,
};
