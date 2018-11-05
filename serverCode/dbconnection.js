var mysql=require('mysql');

//connect to the locally hosted mysql db
//NOTES: if not able to connect to your local db 
//Possible issue 1: authentication or protocol error
//Solution 1: run this SQL command on your db instance
//   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password' 
var connection=mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password"
 
});

module.exports=connection;


 