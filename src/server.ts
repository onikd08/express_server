import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});
const app = express();
const port = 8000;

// parser
app.use(express.json());
// form data
app.use(express.urlencoded({ extended: true }));

// DB
const pool = new Pool({
  connectionString: process.env.CONNECTION_STR,
});

const initDB = async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    age INT,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )`);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
};

initDB();

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  fs.writeFileSync(
    path.join(process.cwd(), "log.txt"),
    `[${new Date().toISOString()}] ${req.method} ${req.path}\n`
  );
  next();
};

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello World");
});

// users API

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
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
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
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
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email]
    );
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
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, id]
    );
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
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);

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
});

// todos api

app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title]
    );
    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "No todos found",
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todos fetched successfully",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id=$1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Todo not found",
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todo fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.put("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `UPDATE todos SET user_id=$1, title=$2 WHERE id=$3 RETURNING *`,
      [user_id, title, id]
    );
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
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM todos WHERE id=$1`, [id]);
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
});

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
