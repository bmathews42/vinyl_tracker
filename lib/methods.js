const mysql = require("mysql2/promise");
const { config } = require("./database");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;

// Create a connection pool
const pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Normal Methods

/**
 * Create a new user in the database
 * @param {string} name - The user's full name
 * @param {string} email - The user's email address
 * @param {string} phone - The user's phone number
 * @param {string} hashed_password - The user's hashed password
 * @returns Promise<number|null> - 0 if user is created, 1 if user already exists, null if error
 * @throws {Error} - Throws an error if the user already exists
 */
async function createUser(name, email, phone, hashed_password) {
  try {
    // Check if user already exists
    const userExists = await getUserByEmail(email);

    if (userExists) {
      console.log("User already exists.");
      return 1; // Exit the function if user already exists
    }

    // Insert new user if user does not exist
    const insertUserSql = /*sql*/ `
      INSERT INTO users (name, email, phone, hashed_password)
      VALUES (?, ?, ?, ? )`;

    await pool.execute(insertUserSql, [name, email, phone, hashed_password]);
    console.log("User created successfully.");
    return 0;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function createVinyl(user, album, artist, url) {
  try {
    // Check if user already exists
    

    
    // Insert new user if user does not exist
    const insertVinylSql = /*sql*/ `
      INSERT INTO vinyl (user_id, album_name, artist_name, art_url)
      VALUES (?, ?, ?, ?)`;

    await pool.execute(insertVinylSql, [user, album, artist, url]);
    console.log("Vinyl created successfully.");
    return 0;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Seed Methods

/**
 * Create the 'user' table in the database
 * @returns Promise<void>
 * @throws {Error} - Throws an error if the query fails
 */
async function createUserTable() {
  try {
    const sql = /*sql*/ `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(10) NOT NULL,
      hashed_password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`;
    await pool.execute(sql);
    console.log("The 'users' table is ready!");
  } catch (err) {
    console.error(err);
  }
}

/**
 * Create the 'vinyl' table in the database
 * @returns Promise<void>
 * @throws {Error} - Throws an error if the query fails
 */
async function createVinylTable() {
  try {
    const sql = /*sql*/ `
    CREATE TABLE IF NOT EXISTS vinyl (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      album_name VARCHAR(100) NOT NULL,
      artist_name VARCHAR(100) NOT NULL,
      art_url VARCHAR(300) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`;
    await pool.execute(sql);
    console.log("The 'vinyl' table is ready!");
  } catch (err) {
    console.error(err);
  }
}

/**
 * Get a user by email address
 * @param {string} email - The user's email address
 * @returns Promise<object|null> - The user object if found, null if not found or error
 * @throws {Error} - Throws an error if the query fails
 */
async function getUserByEmail(email) {
  try {
    const sql = /*sql*/ `SELECT * FROM users WHERE email = ?`;
    const [rows] = await pool.execute(sql, [email]);
    return rows[0];
  } catch (err) {
    console.error(err);
    return null;
  }
}


async function getUserVinyls(user_id) {
  try {
    const sql = /*sql*/ `SELECT * FROM vinyl WHERE user_id = ?`;
    const [rows] = await pool.execute(sql, [user_id]);
    return rows;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getVinylById(id) {
  try {
    const sql = `SELECT * FROM vinyl WHERE id = ?`;
  const [rows] = await pool.execute(sql, [id]);
  return rows;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function deleteVinyl(id) {
  try {
    const sql = `DELETE FROM vinyl WHERE id = ?`;
  const [rows] = await pool.execute(sql, [id]);
  return rows;
  } catch (err) {
    console.error(err);
    return null;
  }
}


module.exports = {
  createUser,
  createUserTable,
  createVinylTable,
  getUserByEmail,
  getUserVinyls,
  createVinyl,
  getVinylById,
  deleteVinyl,
  pool,
};
