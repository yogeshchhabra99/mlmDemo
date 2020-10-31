var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'yogesh',
  password : 'Password@123',
  database : 'MYDB'
});
 
connection.connect();

connection.query('', function (error, results, fields) {
    if (error) throw error;
});
   
connection.end();
  
  