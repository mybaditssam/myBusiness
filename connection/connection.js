const mysql = require('mysql2');

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'business_db',
        port: 8889
    },
    console.log("You've Connected!")
);

module.exports = connection;