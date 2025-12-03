import { pool } from "../../config/db";

const createTodo = async (payload: Record<string, unknown>) => {
  const { user_id, title } = payload;
  const result = await pool.query(
    `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
    [user_id, title]
  );
  return result;
};

const getTodos = async () => {
  const result = await pool.query(`SELECT * FROM todos`);
  return result;
};

const getTodoWithId = async (id: string) => {
  const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);
  return result;
};

const updateTodoWithId = async (
  id: string,
  payload: Record<string, unknown>
) => {
  const { user_id, title } = payload;
  const result = await pool.query(
    `UPDATE todos SET user_id=$1, title=$2 WHERE id=$3 RETURNING *`,
    [user_id, title, id]
  );
  return result;
};

const deleteTodoWithId = async (id: string) => {
  const result = pool.query(`DELETE FROM todos WHERE id=$1`, [id]);
  return result;
};
export const todoServices = {
  createTodo,
  getTodos,
  getTodoWithId,
  updateTodoWithId,
  deleteTodoWithId,
};
