const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_DATABASE
});
const poolPromise = pool.promise();

/**
 * Executes a SQL query and returns the result.
 * @param {string} sql - The SQL query string.
 * @param {Array} [params] - Optional array of query parameters for prepared statements.
 * @returns {Promise<*>} - Returns a promise that resolves with the query result.
 */
async function query(sql, params = []) {
  try {
    const [rows] = await poolPromise.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Begins a transaction.
 * @returns {Promise<Connection>} - Returns a MySQL connection object in a transaction state.
 */
async function beginTransaction() {
  const connection = await poolPromise.getConnection();
  try {
    await connection.beginTransaction();
    return connection;
  } catch (error) {
    connection.release();
    throw error;
  }
}

/**
 * Commits the current transaction.
 * @param {Connection} connection - The MySQL connection object in the transaction.
 * @returns {Promise<void>}
 */
async function commit(connection) {
  try {
    await connection.commit();
    connection.release();
  } catch (error) {
    connection.release();
    throw error;
  }
}

/**
 * Rolls back the current transaction.
 * @param {Connection} connection - The MySQL connection object in the transaction.
 * @returns {Promise<void>}
 */
async function rollback(connection) {
  try {
    await connection.rollback();
    connection.release();
  } catch (error) {
    connection.release();
    throw error;
  }
}


module.exports = { 
  query,
  beginTransaction,
  commit,
  rollback
};
