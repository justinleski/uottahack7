const mysql = require('mysql2');
require('dotenv').config();

module.exports = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: process.env.NIKOLAI ? '06192352' : '',
    database: "wild_around"
});