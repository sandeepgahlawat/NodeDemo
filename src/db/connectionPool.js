/*jshint esversion: 6 */
/* jshint -W033 */

import mysql from 'mysql2/promise'

const options = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
}

const pool = mysql.createPool(options)

module.exports = pool