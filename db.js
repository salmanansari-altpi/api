const mysql = require('mysql2/promise')

const mysqlPool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.db
})

module.exports = mysqlPool