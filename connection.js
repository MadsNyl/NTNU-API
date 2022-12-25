const mysql = require("mysql2/promise");
require("dotenv").config();

const DB = process.env.DB;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;

const pool = mysql.createPool({
    host: DB_HOST,
    database: DB,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    connectionLimit: 10 
});

module.exports = {
    pool
}