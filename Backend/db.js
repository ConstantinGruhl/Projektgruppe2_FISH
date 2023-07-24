const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fish_2023',
    database: 'fishdb',
});

db.connect(error =>
{
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = db;
