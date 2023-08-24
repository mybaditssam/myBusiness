const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        passworrd: 'root',
        database: 'business_db'
    },
    console.log("You've Connected!")
);

module.exports = db;