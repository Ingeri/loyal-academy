
const { loadEnvConfig } = require('@next/env');
const mariadb = require('mariadb');

loadEnvConfig(process.cwd());

async function testConnection() {
  let connection;

  try {
    connection = await mariadb.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 5000,
  allowPublicKeyRetrieval: true,
});

    const rows = await connection.query(
      'SELECT COUNT(*) AS total_courses FROM course'
    );

    console.log('Database connection successful.');
    console.log('Total courses:', String(rows[0].total_courses));
  } catch (error) {
    console.error('Database connection failed.');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();
