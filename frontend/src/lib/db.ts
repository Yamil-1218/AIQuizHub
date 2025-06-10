import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//hacer destructuring y devolver solo las filas (rows)
export async function query(sql: string, values?: any[]) {
  const [rows] = await db.execute(sql, values);
  return rows;
}
