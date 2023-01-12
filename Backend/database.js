var mysql = require ('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    database : 'employee_database',
    user : 'root',
    password : 'asdfghjkl@1999#'
});

module.exports = connection;