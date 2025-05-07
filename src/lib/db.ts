import mysql from 'mysql2/promise';

// Ensure environment variables are defined or provide defaults
const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASS || 'password';
const dbName = process.env.DB_NAME || 'logistics_app';

// It's good practice to log if essential env vars are missing during setup,
// but for now, we'll use defaults if not set.
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_NAME) {
  console.warn(
    'One or more database environment variables (DB_HOST, DB_USER, DB_PASS, DB_NAME) are not set. Using default values.'
  );
}

export const db = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Example function to test connection (optional)
export async function testDbConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Successfully connected to the database.');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }
}

// You can add more utility functions here for common queries if not using a full ORM
