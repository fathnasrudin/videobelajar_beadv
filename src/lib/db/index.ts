import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123123123",
  database: "test123",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = pool;
